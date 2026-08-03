import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SSRProvider } from '@fluentui/react-components';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { FaqAccordion } from '../components/faq/FaqAccordion.jsx';
import { AMNISTIA_FAQ, FAQ_CATEGORIES } from '../config/amnistiaFaq.js';
import { FaqPage } from '../pages/FaqPage.jsx';
import { SimuladorPage } from '../pages/SimuladorPage.jsx';
import { AppThemeProvider } from '../providers/AppThemeProvider.tsx';
import { filterFaqItems } from './faqSearch.js';

function renderWithProviders(element, initialEntry = '/preguntas-frecuentes') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderToStaticMarkup(createElement(SSRProvider, null,
    createElement(AppThemeProvider, null,
      createElement(QueryClientProvider, { client: queryClient },
        createElement(MemoryRouter, { initialEntries: [initialEntry] }, element)))));
}

describe('preguntas frecuentes de amnistía', () => {
  it('incluye las 38 preguntas y las siete categorías requeridas', () => {
    expect(AMNISTIA_FAQ).toHaveLength(38);
    expect(FAQ_CATEGORIES.map((category) => category.label)).toEqual([
      'Información general', 'Descuentos y formas de pago', 'Cuotas y Unidades Indexadas',
      'Vivienda propia', 'Convenios e incumplimientos', 'Simulador y resultado final', 'Plazos y consultas',
    ]);
  });

  it('filtra por pregunta, respuesta, mayúsculas y tildes', () => {
    expect(filterFaqItems(AMNISTIA_FAQ, 'VIVIENDA PROPIA', 'all').some((item) => item.id === 'vivienda-propia')).toBe(true);
    expect(filterFaqItems(AMNISTIA_FAQ, 'unidades indexadas', 'all').some((item) => item.id === 'unidades-indexadas')).toBe(true);
    expect(filterFaqItems(AMNISTIA_FAQ, 'inflacion', 'all').some((item) => item.id === 'quita-no-ajusta-ipc')).toBe(true);
    expect(filterFaqItems(AMNISTIA_FAQ, 'trimestrales', 'all').some((item) => item.id === 'incumplimiento-trimestral')).toBe(true);
    expect(filterFaqItems(AMNISTIA_FAQ, 'palabra inexistente', 'all')).toEqual([]);
  });

  it('filtra por categoría sin mezclar preguntas de otros temas', () => {
    const housingItems = filterFaqItems(AMNISTIA_FAQ, '', 'housing');
    expect(housingItems).toHaveLength(5);
    expect(housingItems.every((item) => item.category === 'housing')).toBe(true);
  });

  it('renderiza la página, categorías, buscador, resumen y acordeones accesibles', () => {
    const html = renderWithProviders(createElement(FaqPage));
    expect(html).toContain('Preguntas frecuentes');
    expect(html).toContain('Buscar una pregunta');
    expect(html).toContain('Opciones de pago, de un vistazo');
    expect(html).toContain('Pago al contado');
    for (const category of FAQ_CATEGORIES) expect(html).toContain(category.label);
    expect(html).toContain('¿Qué es este régimen de regularización?');
  });

  it('incluye encabezados de acordeón operables con atributos de expansión', () => {
    const item = AMNISTIA_FAQ.find((faq) => faq.id === 'unidades-indexadas');
    const html = renderToStaticMarkup(createElement(FaqAccordion, { items: [item], openItems: [], onToggle: () => {} }));
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('id="unidades-indexadas"');
  });

  it('mantiene la ruta y el acceso desde el simulador', () => {
    const faqHtml = renderWithProviders(createElement(FaqPage));
    const simulatorHtml = renderWithProviders(createElement(SimuladorPage), '/simulador/calcular');
    expect(faqHtml).toContain('Esta información resume el decreto en lenguaje ciudadano.');
    expect(simulatorHtml).toContain('Ver preguntas frecuentes');
    expect(simulatorHtml).toContain('href="/preguntas-frecuentes"');
  });

  it('mantiene las aclaraciones normativas y no agrega contactos inventados', () => {
    const content = JSON.stringify(AMNISTIA_FAQ);
    expect(content).toContain('solamente sobre las multas y los recargos');
    expect(content).toContain('La deuda tributaria principal no recibe descuento');
    expect(content).toContain('autorización correspondiente del Ministerio de Economía y Finanzas');
    expect(content).toContain('está sujeto a acreditación y evaluación');
    expect(content).toContain('La simulación no congela la deuda');
    expect(content).toContain('La entrega inicial mínima equivale al 30% de ese total regularizado');
    expect(content).toContain('no se reajusta por IPC ni queda atado a la inflación');
    expect(content).toContain('su equivalente en pesos puede variar');
    expect(content).not.toMatch(/@|https?:\/\/|\+598|teléfono|correo electrónico/i);
  });
});
