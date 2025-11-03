# e-Kunde API

## A new way to care for your mind and community

![Mental Health East Africa](https://img.shields.io/badge/Mental%20Health-East%20Africa-green.svg)
![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![Built with NestJS](https://img.shields.io/badge/built%20with-NestJS-ea2845.svg)
![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)

## A safe digital space to care, connect, and grow — powered by AI, guided by compassion\*

Mental health in East Africa faces unique challenges—from stigma to access. **e-Kunde** was born from a need for a space that understands. We're not just an app; we're a **digital hearth for healing, connection, and growth**, built on shared experiences and cultural understanding.

We bridge technology with empathy, offering inclusive tools for students, clinics, universities, and NGOs. Our mission is to make mental wellness a tangible, daily practice for everyone.

## ✨ What Makes e-Kunde Different

- **🏠 Cultural Understanding**: Built specifically for East African communities and contexts
- **🤝 Community-Centered**: Fostering connections within and between communities
- **🎓 Multi-Institutional**: Supporting students, clinics, universities, and NGOs
- **🧠 AI + Empathy**: Technology that amplifies human compassion rather than replacing it
- **🛡️ Stigma-Free Zone**: Creating safe spaces where mental health conversations can flourish
- **📱 Accessible**: Making mental wellness tools available where they're needed most

## 🚀 Core Features

### For Individuals

- **🧘 Wellness Tracking**: Daily mental health check-ins and mood monitoring
- **📚 Educational Resources**: Culturally relevant mental health information and coping strategies
- **🤖 AI Companion**: Compassionate AI assistant trained on mental health best practices
- **🔒 Privacy First**: End-to-end encryption and anonymous options for sensitive conversations

### For Communities

- **👥 Peer Support Groups**: Moderated community spaces for shared experiences
- **🎯 Crisis Intervention**: 24/7 support pathways and emergency resource connections
- **📊 Community Insights**: Anonymous aggregate data to understand community mental health trends

### For Institutions

- **🏫 Student Support**: Tools for universities to support student mental wellness
- **🏥 Clinic Integration**: API endpoints for healthcare providers and mental health clinics
- **📈 Analytics Dashboard**: Insights for NGOs and institutions to track program effectiveness
- **🔗 Resource Sharing**: Platform for organizations to share mental health resources

## Technology Stack

- **Framework**: NestJS 11.0.1
- **Runtime**: Node.js
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd e-kunde-api
```

2. Install dependencies:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000`

### Other Commands

```bash
# Build for production
pnpm run build

# Start in production mode
pnpm run start:prod

# Debug mode
pnpm run start:debug

# Format code
pnpm run format

# Lint code
pnpm run lint
```

## Testing

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run end-to-end tests
pnpm run test:e2e

# Generate test coverage report
pnpm run test:cov

# Debug tests
pnpm run test:debug
```

## Project Structure

```
src/
├── app.controller.ts      # Main application controller
├── app.controller.spec.ts # Controller unit tests
├── app.module.ts          # Root application module
├── app.service.ts         # Application service layer
└── main.ts               # Application entry point
test/
├── app.e2e-spec.ts       # End-to-end tests
└── jest-e2e.json         # E2E test configuration
```

## API Documentation

Once the server is running, API documentation will be available at:

- Development: `http://localhost:3000/api` (if Swagger is configured)

## Environment Configuration

Create a `.env` file in the root directory for environment-specific configurations:

```env
# Application
NODE_ENV=development
PORT=3000

# Add other environment variables as needed
```

## Contributing

We welcome contributions that align with our mission of creating a compassionate digital space. Please ensure that any contributions:

1. **Follow our values**: Prioritize user safety, privacy, and well-being
2. **Maintain code quality**: Follow the established linting and testing standards
3. **Include tests**: Add appropriate unit and integration tests
4. **Document changes**: Update relevant documentation

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm run test`
5. Commit your changes: `git commit -m 'Add some amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 🌱 Impact Goals

e-Kunde aims to address the critical mental health challenges in East Africa by:

- **Breaking Stigma**: Creating culturally sensitive platforms where mental health discussions are normalized
- **Increasing Access**: Providing digital-first solutions where traditional mental health services are limited
- **Building Community**: Fostering peer support networks within educational and healthcare institutions
- **Empowering Institutions**: Giving universities, clinics, and NGOs tools to better serve their communities
- **Data-Driven Insights**: Helping organizations understand and respond to community mental health needs

## 🔒 Privacy & Ethics

Mental health data is deeply personal. e-Kunde is built with privacy-by-design principles:

- **Anonymization Options**: Users can engage without revealing personal identifiers
- **Data Sovereignty**: All data remains under user control with transparent usage policies
- **Cultural Sensitivity**: AI models trained with East African cultural contexts and values
- **Ethical AI**: Technology designed to augment human empathy, not replace human connection

## 🤝 Community Guidelines

e-Kunde thrives on mutual respect and cultural understanding:

1. **Respect Cultural Diversity**: Honor the rich diversity of East African communities
2. **Practice Empathy**: Approach all interactions with compassion and understanding
3. **Maintain Confidentiality**: Respect the privacy and vulnerability of community members
4. **Seek Help When Needed**: Know when to escalate to professional mental health support

## 📞 Crisis Resources

If you or someone you know is in immediate danger, please contact:

- **Emergency Services**: Your local emergency number
- **Mental Health Hotlines**: [To be populated with regional resources]
- **Crisis Text Lines**: [To be populated with regional resources]

## 🛡️ Security

If you discover a security vulnerability, please send an email to **waka.florien45@gmail.com** instead of using the issue tracker. Security issues affecting user mental health data are treated with the highest priority.

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com) - Learn more about the NestJS framework
- [WHO Mental Health Resources](https://www.who.int/health-topics/mental-disorders) - Global mental health guidelines
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript language reference
- [Jest Testing Framework](https://jestjs.io/docs/getting-started) - Testing documentation

## 📄 License

This project is licensed under UNLICENSED - see the `package.json` file for details.

## 💬 Contact & Support

**Author**: Waka Florien  
**Email**: waka.florien45@gmail.com

For support, questions, or collaboration opportunities related to e-Kunde API, please reach out via email or create an issue in the repository.

---

_Building bridges between technology and compassion, one connection at a time._ 🌍💙
