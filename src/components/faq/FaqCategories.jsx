import { Button } from '@fluentui/react-components';

export function FaqCategories({ categories, selectedCategory, onSelect }) {
  return (
    <nav className="faq-categories" aria-label="Categorías de preguntas frecuentes">
      <Button
        appearance={selectedCategory === 'all' ? 'primary' : 'secondary'}
        aria-pressed={selectedCategory === 'all'}
        onClick={() => onSelect('all')}
      >
        Todas
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          appearance={selectedCategory === category.id ? 'primary' : 'secondary'}
          aria-pressed={selectedCategory === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </nav>
  );
}
