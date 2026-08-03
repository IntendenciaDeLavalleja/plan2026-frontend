import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Badge, MessageBar, MessageBarBody, Text } from '@fluentui/react-components';

export function FaqAccordion({ items, openItems, onToggle }) {
  return (
    <Accordion multiple collapsible openItems={openItems} onToggle={(_, data) => onToggle(data.openItems)}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} id={item.id} tabIndex={-1} className={item.highlight ? 'faq-highlight-item' : undefined}>
          <AccordionHeader expandIconPosition="end">
            <span className="faq-question-heading">
              {item.question}
              {item.highlight && <Badge color="informative" appearance="outline">Importante</Badge>}
            </span>
          </AccordionHeader>
          <AccordionPanel>
            <div className="faq-answer">
              {item.answer.slice(0, 1).map((paragraph) => <Text key={paragraph} as="p">{paragraph}</Text>)}
              {item.bullets && (
                <ul>{item.bullets.map((bullet) => <li key={bullet}><Text>{bullet}</Text></li>)}</ul>
              )}
              {item.answer.slice(1).map((paragraph) => <Text key={paragraph} as="p">{paragraph}</Text>)}
              {item.note && <MessageBar intent="info"><MessageBarBody>{item.note}</MessageBarBody></MessageBar>}
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
