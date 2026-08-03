export const OFFICIAL_DEBT_QUERY_URL = 'https://epagos.sifi.gub.uy/lavgeowsprod/servlet/hconsultadeuda';

export const tutorialDebtSummary = Object.freeze([
  { concept: 'CONT. URBANA', amountCents: 1295164, destination: 'Principal' },
  { concept: 'SALUBRIDAD Y LIMPIEZA URBANA', amountCents: 2960936, destination: 'Principal' },
  { concept: 'REG. INMUEBLES CIU', amountCents: 845977, destination: 'Principal' },
  { concept: 'MULTAS SOBRE CIU/CIS', amountCents: 239332, destination: 'Multas' },
  { concept: 'MULTAS SOBRE TASAS', amountCents: 727739, destination: 'Multas' },
  { concept: 'RECARGOS SOBRE CIU/CIS', amountCents: 1132790, destination: 'Recargos' },
]);

export const tutorialNonExpiredInstallments = Object.freeze([
  { id: 'c3', label: 'Cuota 3/4', date: '30/09/2026', urbanaCents: 39402, salubridadCents: 67294 },
  { id: 'c4', label: 'Cuota 4/4', date: '28/12/2026', urbanaCents: 39402, salubridadCents: 67294 },
]);

export const tutorialPaymentOptions = Object.freeze([
  { discount: '80%', title: 'Vivienda propia', detail: 'Requiere declaración jurada y evaluación del Tribunal de Quitas y Esperas.' },
  { discount: '70%', title: 'Pago al contado', detail: 'Cancelás todo en un solo pago.' },
  { discount: '60%', title: 'Entrega + saldo en 2 cuotas', detail: 'Entrega mínima del 30% del total regularizado.' },
  { discount: '50%', title: 'Entrega + hasta 36 cuotas', detail: 'Mensuales o hasta 12 pagos trimestrales.' },
  { discount: '40%', title: 'Facilidades hasta 36 cuotas', detail: 'Sin entrega inicial.' },
]);

export const simulatorTutorialSteps = Object.freeze([
  {
    id: 'inicio',
    label: 'Inicio',
    eyebrow: 'Guía',
    title: 'Estimá tu quita antes de venir a la Intendencia',
    description: 'El simulador muestra cuánto podés ahorrar en multas y recargos según cómo elijas pagar. Para que el resultado sea fiel, primero hay que obtener los montos correctos de la consulta de deuda.',
    instructions: [
      'Consultás tu deuda en el sitio oficial de tributos.',
      'Bajás al Resumen de deuda y ubicás los rubros.',
      'Restás las cuotas no vencidas de los rubros donde figuran.',
      'Ponés los números resultantes en cada campo y calculás.',
    ],
    callouts: [
      { intent: 'info', text: 'Tené a mano tu número de padrón o ID de padrón y la localidad del inmueble.' },
      { intent: 'warning', text: 'La quita se aplica solo sobre multas y recargos. La deuda tributaria principal no recibe descuento.' },
    ],
  },
  {
    id: 'consulta',
    label: 'Consultar',
    eyebrow: 'Paso 1',
    title: 'Abrí la consulta de deuda y elegí el tipo de padrón',
    description: 'Entrá al sitio de Consulta de Tributos. En Tipo Padrón elegí Urbana o Suburbana según tu inmueble.',
    callouts: [
      { intent: 'info', text: 'Esta guía usa un ejemplo de contribución urbana. Para suburbana el procedimiento es idéntico, con los rubros equivalentes de esa categoría.' },
    ],
  },
  {
    id: 'padron',
    label: 'Padrón',
    eyebrow: 'Paso 2',
    title: 'Elegí la localidad, poné el padrón y tocá Buscar',
    description: 'Elegí siempre la Localidad. Después ingresá tu ID de Padrón o, si no lo tenés, el N.º de Padrón. Por último tocá Buscar.',
    instructions: [
      'Elegí siempre la Localidad del inmueble. Sin localidad no se puede buscar, ni siquiera con el ID.',
      'Ingresá el ID de Padrón si lo conocés; si no, el N.º de Padrón y PH o Block si corresponde.',
      'Tocá Buscar para traer el detalle de la deuda.',
    ],
  },
  {
    id: 'resumen',
    label: 'Resumen',
    eyebrow: 'Paso 3',
    title: 'Bajá hasta el final: el Resumen de deuda',
    description: 'Arriba aparece el detalle cuota por cuota. Desplazate hasta abajo, donde el sistema junta todo en la tabla Resumen de deuda: de ahí salen los números.',
    callouts: [
      { intent: 'warning', text: 'Fijate si al final del detalle hay cuotas con fecha futura. Anotalas: en el próximo paso las restamos.' },
      { intent: 'info', text: 'Derechos de expedición y Ajuste por redondeo no se cargan en el simulador. Se dejan afuera.' },
      { intent: 'info', text: 'Los rubros se agrupan por destino: principal, multas y recargos. Los usaremos al completar los campos.' },
    ],
  },
  {
    id: 'restar',
    label: 'Restar',
    eyebrow: 'Paso 4',
    title: 'Restá las cuotas que todavía no vencieron',
    description: 'Al final del detalle pueden aparecer cuotas con fecha futura. Como todavía no vencieron, no están afectadas por deuda: hay que restarlas de los rubros donde figuran.',
    callouts: [
      { intent: 'info', text: 'Estas cuotas sólo suman en contribución urbana y salubridad. No tienen multas ni recargos, por eso esos importes no cambian.' },
    ],
  },
  {
    id: 'campos',
    label: 'Campos',
    eyebrow: 'Paso 5',
    title: 'Poné los números resultantes en cada campo',
    description: 'Con los rubros ajustados, agrupá cada total por su destino y cargalo en el casillero correspondiente del simulador.',
    callouts: [
      { intent: 'info', text: 'Estos son los números finales del ejemplo. Copialos en el simulador como principal, multas y recargos.' },
    ],
  },
  {
    id: 'calcular',
    label: 'Calcular',
    eyebrow: 'Paso 6',
    title: 'Cargá los montos y tocá Calcular',
    description: 'Copiá los tres valores ya ajustados en el simulador y presioná Calcular. Vas a ver las modalidades de pago con su quita.',
    callouts: [
      { intent: 'info', text: 'Si el inmueble es tu vivienda, mirá también la pestaña Vivienda propia: la quita puede llegar al 80%.' },
      { intent: 'warning', text: 'La simulación es informativa. No congela la deuda: el importe definitivo lo determina la Intendencia al suscribir el convenio.' },
    ],
  },
  {
    id: 'modalidades',
    label: 'Modalidades',
    eyebrow: 'Listo',
    title: 'Elegí cómo pagar según la quita que buscás',
    description: 'Cuanto más rápido cancelás, mayor es la quita sobre multas y recargos. Este es el cuadro completo de modalidades.',
    callouts: [
      { intent: 'info', text: 'El saldo financiado se convierte a Unidades Indexadas al firmar. La primera cuota vence a los 30 días.' },
      { intent: 'warning', text: 'Ya podés reservar tu turno en la Intendencia con estos números a mano para formalizar el convenio.' },
    ],
  },
]);

export function formatTutorialAmount(amountCents) {
  return (amountCents / 100).toLocaleString('es-UY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
