import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitMatchingTestDto } from './dto/submit-matching-test.dto';

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Submit a matching test and get recommendations
   */
  async submitTest(userId: string | null, dto: SubmitMatchingTestDto) {
    // 1. Fetch all active practitioners
    const practitioners = await this.prisma.practitionerProfile.findMany({
      where: { acceptingNewPatients: true },
      include: { user: { select: { id: true, profile: true } } }, // Fetch user profile for name/gender
    });

    const results: any[] = [];

    // 2. Scoring Algorithm
    for (const p of practitioners) {
      let score = 0;
      const totalPossible = 100;

      // Criteria 1: Specialization Match (40%)
      // Simple string matching for now. Real world would use embeddings or keywords.
      const hasSpecialization = p.specialization.some(s => 
        dto.symptoms.some(sym => s.toLowerCase().includes(sym.toLowerCase()) || sym.toLowerCase().includes(s.toLowerCase()))
      );
      if (hasSpecialization) score += 40;

      // Criteria 2: Language Match (20%)
      if (dto.languages) {
        const commonLanguages = p.languages.filter(l => dto.languages!.includes(l));
        if (commonLanguages.length > 0) score += 20;
      } else {
        score += 20; // If no preference, give full points
      }

      // Criteria 3: Fee (20%)
      if (dto.maxFee) {
        if (Number(p.consultationFee) <= dto.maxFee) score += 20;
      } else {
        score += 20;
      }

      // Criteria 4: Gender Preference (20%)
      score += 20; 

      // Threshold
      if (score > 40) {
        results.push({
          practitionerId: p.userId, // Validated
          practitioner: p,
          score,
        });
      }
    }

    // 3. Sort by Score
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, 10); // Top 10

    // 4. Save Test Record
    const test = await this.prisma.matchingTest.create({
      data: {
        userId: userId || undefined, // Handle null vs undefined for Prisma
        inputData: JSON.parse(JSON.stringify(dto)), // Ensure proper JSON
        status: 'COMPLETED',
        results: {
          create: topResults.map((r: any) => ({
             practitionerId: r.practitionerId,
             score: r.score
          }))
        }
      },
      include: {
        results: true
      }
    });

    // 5. Return enriched results
    return {
      testId: test.id,
      matches: topResults.map((r: any) => ({
        practitioner: {
          id: r.practitioner.userId,
          name: `${r.practitioner.user.profile?.firstName || 'Dr.'} ${r.practitioner.user.profile?.lastName || 'Practitioner'}`,
          specialization: r.practitioner.specialization,
          fee: r.practitioner.consultationFee,
          languages: r.practitioner.languages,
        },
        score: r.score,
      }))
    };
  }
}
