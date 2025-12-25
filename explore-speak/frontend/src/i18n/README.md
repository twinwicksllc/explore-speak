# ExploreSpeak Translation System

## Overview
ExploreSpeak uses a simple, lightweight internationalization (i18n) system that allows users to switch the entire app interface between English, Portuguese (Brazilian), and Spanish (Mexican).

## Features
- **3 Languages Supported**: English (en), Portuguese (pt), Spanish (es)
- **Automatic Language Detection**: Detects browser language on first visit
- **Persistent Selection**: Saves user's language preference in localStorage
- **No External Dependencies**: Pure TypeScript/React implementation
- **Type-Safe**: Full TypeScript support with type definitions

## How It Works

### 1. Translation Files
All translations are stored in `translations.ts`:
```typescript
export const translations: Record<Language, Translations> = {
  en: { /* English translations */ },
  pt: { /* Portuguese translations */ },
  es: { /* Spanish translations */ }
};
```

### 2. Language Context
The `LanguageContext` provides language state and translation function throughout the app:
```typescript
const { language, setLanguage, t } = useLanguage();
```

### 3. Language Switcher Component
A dropdown component that allows users to change the interface language:
```typescript
<LanguageSwitcher />
```

## Usage in Components

### Basic Usage
```typescript
import { useLanguage } from '../context/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t.dashboard.welcomeBack}</h1>
      <p>{t.dashboard.readyToContinue}</p>
    </div>
  );
};
```

### With Language Switcher
```typescript
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const MyPage = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <nav>
        <LanguageSwitcher />
      </nav>
      <h1>{t.nav.exploreSpeak}</h1>
    </div>
  );
};
```

## Adding New Translations

### 1. Update Type Definition
Add new keys to the `Translations` interface in `translations.ts`:
```typescript
export interface Translations {
  // ... existing translations
  newSection: {
    newKey: string;
    anotherKey: string;
  };
}
```

### 2. Add Translations for All Languages
Update all three language objects (en, pt, es):
```typescript
export const translations: Record<Language, Translations> = {
  en: {
    newSection: {
      newKey: 'English text',
      anotherKey: 'More English text'
    }
  },
  pt: {
    newSection: {
      newKey: 'Texto em português',
      anotherKey: 'Mais texto em português'
    }
  },
  es: {
    newSection: {
      newKey: 'Texto en español',
      anotherKey: 'Más texto en español'
    }
  }
};
```

### 3. Use in Components
```typescript
const { t } = useLanguage();
return <p>{t.newSection.newKey}</p>;
```

## Translation Categories

### Current Categories
- **nav**: Navigation elements (menu items, buttons)
- **dashboard**: Dashboard page content
- **languageSelection**: Language selection page
- **quests**: Quest-related content
- **tommy**: Tommy AI Guide content
- **auth**: Authentication pages (login, signup)
- **common**: Common UI elements (buttons, messages)
- **settings**: Settings and preferences

## Best Practices

### 1. Keep Keys Descriptive
```typescript
// Good
t.dashboard.welcomeBack

// Avoid
t.dashboard.text1
```

### 2. Group Related Translations
```typescript
// Good
auth: {
  welcomeBack: string;
  signInToContinue: string;
}

// Avoid
welcomeBack: string;
signInToContinue: string;
```

### 3. Use Consistent Naming
- Use camelCase for keys
- Use descriptive names that indicate content
- Group by page or feature

### 4. Handle Dynamic Content
For content with variables, use template strings:
```typescript
// In component
<h2>{t.dashboard.welcomeBack}, {user.name}! 👋</h2>
```

## Language Detection

The system automatically detects the user's browser language on first visit:
```typescript
const browserLang = navigator.language.toLowerCase();
if (browserLang.startsWith('pt')) return 'pt';
if (browserLang.startsWith('es')) return 'es';
return 'en';
```

## Persistence

User's language preference is saved in localStorage:
```typescript
localStorage.setItem('appLanguage', lang);
```

## Styling

The LanguageSwitcher component includes:
- Responsive design for mobile and desktop
- Dark mode support
- High contrast mode support
- Smooth animations and transitions

## Testing Translations

### Manual Testing
1. Open the app
2. Click the language switcher
3. Select each language
4. Verify all text displays correctly
5. Check for missing translations (will show as undefined)

### Automated Testing
```typescript
// Example test
describe('Translations', () => {
  it('should have all required keys', () => {
    const languages: Language[] = ['en', 'pt', 'es'];
    languages.forEach(lang => {
      expect(translations[lang].nav.exploreSpeak).toBeDefined();
      expect(translations[lang].dashboard.welcomeBack).toBeDefined();
    });
  });
});
```

## Future Enhancements

### Potential Additions
1. **More Languages**: French, Italian, Japanese, German
2. **RTL Support**: For Arabic, Hebrew
3. **Pluralization**: Handle singular/plural forms
4. **Date/Time Formatting**: Locale-specific formatting
5. **Number Formatting**: Currency, percentages
6. **Translation Management**: Admin interface for managing translations

## Troubleshooting

### Missing Translations
If you see `undefined` in the UI:
1. Check if the key exists in `translations.ts`
2. Verify the key path is correct
3. Ensure all three languages have the translation

### Language Not Persisting
1. Check browser localStorage is enabled
2. Verify localStorage key is 'appLanguage'
3. Check for console errors

### Language Switcher Not Appearing
1. Ensure `LanguageProvider` wraps your app
2. Import and use `<LanguageSwitcher />` component
3. Check CSS is imported

## Support

For questions or issues with the translation system, please refer to:
- Translation file: `frontend/src/i18n/translations.ts`
- Context: `frontend/src/context/LanguageContext.tsx`
- Component: `frontend/src/components/LanguageSwitcher.tsx`