import { useEffect, useMemo, useState } from 'react';
import { Info24Regular } from '@fluentui/react-icons';
import { MessageBar, MessageBarBody, Text, Title1 } from '@fluentui/react-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaqAccordion } from '../components/faq/FaqAccordion.jsx';
import { FaqCategories } from '../components/faq/FaqCategories.jsx';
import { FaqSearch } from '../components/faq/FaqSearch.jsx';
import { PaymentOverview } from '../components/faq/PaymentOverview.jsx';
import { PublicLayout } from '../components/layout/PublicLayout.tsx';
import { AMNISTIA_FAQ, FAQ_CATEGORIES, HOUSING_OVERVIEW, PAYMENT_OVERVIEW } from '../config/amnistiaFaq.js';
import { filterFaqItems } from '../lib/faqSearch.js';

export function FaqPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState([]);
  const hashTarget = useMemo(() => {
    const targetId = location.hash.slice(1);
    return AMNISTIA_FAQ.some((item) => item.id === targetId) ? targetId : null;
  }, [location.hash]);
  const visibleItems = useMemo(
    () => filterFaqItems(AMNISTIA_FAQ, hashTarget ? '' : query, hashTarget ? 'all' : selectedCategory),
    [hashTarget, query, selectedCategory],
  );
  const visibleOpenItems = hashTarget && !openItems.includes(hashTarget) ? [...openItems, hashTarget] : openItems;

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content');
    document.title = 'Preguntas frecuentes sobre la amnistía | Intendencia de Lavalleja';
    if (description) description.setAttribute('content', 'Respuestas sencillas sobre descuentos, multas, recargos, cuotas, vivienda propia y formas de pago de la amnistía de Contribución Inmobiliaria.');
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) description.setAttribute('content', previousDescription);
    };
  }, []);

  useEffect(() => {
    if (hashTarget) window.requestAnimationFrame(() => document.getElementById(hashTarget)?.focus());
  }, [hashTarget]);

  function clearHash() {
    if (location.hash) navigate(location.pathname, { replace: true });
  }

  return (
    <PublicLayout>
      <div className="faq-page">
        <div className="af-container faq-container af-stack-lg">
          <header className="faq-heading">
            <div className="faq-eyebrow"><Info24Regular aria-hidden="true" /> Información para la ciudadanía</div>
            <Title1>Preguntas frecuentes</Title1>
            <Text size={400} className="af-muted">Encontrá respuestas sencillas sobre la amnistía, las formas de pago, los descuentos y el funcionamiento del simulador.</Text>
            <MessageBar intent="info"><MessageBarBody>Esta información resume el decreto en lenguaje ciudadano. El cálculo definitivo será realizado por la Intendencia al momento de formalizar el trámite.</MessageBarBody></MessageBar>
          </header>

          <FaqSearch value={query} onChange={(value) => { clearHash(); setQuery(value); }} />
          <FaqCategories categories={FAQ_CATEGORIES} selectedCategory={selectedCategory} onSelect={(category) => { clearHash(); setSelectedCategory(category); }} />
          <PaymentOverview options={PAYMENT_OVERVIEW} housingOption={HOUSING_OVERVIEW} />

          <section className="faq-list" aria-labelledby="faq-list-title">
            <div className="af-row" style={{ justifyContent: 'space-between' }}>
              <Text id="faq-list-title" weight="semibold">Preguntas y respuestas</Text>
              <Text className="af-muted" aria-live="polite">{visibleItems.length} {visibleItems.length === 1 ? 'respuesta encontrada' : 'respuestas encontradas'}</Text>
            </div>
            {visibleItems.length > 0 ? (
              <FaqAccordion items={visibleItems} openItems={visibleOpenItems} onToggle={setOpenItems} />
            ) : (
              <div className="faq-empty" role="status" aria-live="polite">
                No encontramos una respuesta con esas palabras. Probá con otro término o consultá directamente en la Intendencia.
              </div>
            )}
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
