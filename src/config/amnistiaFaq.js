export const FAQ_CATEGORIES = Object.freeze([
  { id: 'general', label: 'Información general' },
  { id: 'discounts', label: 'Descuentos y formas de pago' },
  { id: 'installments', label: 'Cuotas y Unidades Indexadas' },
  { id: 'housing', label: 'Vivienda propia' },
  { id: 'agreements', label: 'Convenios e incumplimientos' },
  { id: 'simulator', label: 'Simulador y resultado final' },
  { id: 'deadlines', label: 'Plazos y consultas' },
]);

export const PAYMENT_OVERVIEW = Object.freeze([
  { id: 'cash', title: 'Pago al contado', discount: '70% de quita sobre multas y recargos', detail: 'Sin cuotas' },
  { id: 'partial-two', title: 'Entrega mínima: 30% del total regularizado', discount: '60% de quita', detail: 'Saldo en hasta 2 cuotas mensuales' },
  { id: 'partial-long', title: 'Entrega mínima: 30% del total regularizado', discount: '50% de quita', detail: 'Saldo en hasta 36 cuotas mensuales o 12 pagos trimestrales' },
  { id: 'financed', title: 'Sin entrega inicial obligatoria', discount: '40% de quita', detail: 'Hasta 36 cuotas mensuales o 12 pagos trimestrales' },
]);

export const HOUSING_OVERVIEW = Object.freeze({
  title: 'Vivienda propia',
  discount: '80% de quita sobre multas y recargos',
  detail: 'Sujeto a documentación y evaluación del Tribunal',
});

export const AMNISTIA_FAQ = Object.freeze([
  {
    id: 'que-es-la-amnistia', category: 'general', question: '¿Qué es este régimen de regularización?',
    answer: ['Es una oportunidad para ponerse al día con deudas vencidas de Contribución Inmobiliaria Urbana o Suburbana.', 'El régimen permite elegir distintas formas de pago y obtener una reducción de las multas y los recargos generados por la deuda.'],
    keywords: ['amnistía', 'regularización', 'deuda'],
  },
  {
    id: 'deudas-incluidas', category: 'general', question: '¿Qué deudas están incluidas?',
    answer: ['Comprende deudas vencidas de Contribución Inmobiliaria Urbana y Suburbana, junto con los demás tributos que se cobran conjuntamente con esa contribución.', 'La Contribución Inmobiliaria Rural solo podrá incluirse si existe la autorización correspondiente del Ministerio de Economía y Finanzas.'],
    keywords: ['deudas', 'rural', 'urbana', 'suburbana'],
  },
  {
    id: 'quita-sobre-multas-y-recargos', category: 'general', question: '¿La quita reduce toda la deuda?', highlight: true,
    answer: ['No. La quita se aplica solamente sobre las multas y los recargos.', 'La deuda tributaria principal no recibe descuento y debe pagarse íntegramente.'],
    keywords: ['quita', 'deuda principal', 'multas', 'recargos', 'descuento'],
  },
  {
    id: 'diferencia-deuda-multas-recargos', category: 'general', question: '¿Qué diferencia hay entre deuda principal, multas y recargos?',
    answer: ['La deuda principal es el importe original adeudado por la Contribución Inmobiliaria y los tributos que se cobran junto con ella.', 'Las multas y los recargos son importes adicionales generados por no haber pagado la deuda en fecha. Los descuentos del régimen se aplican únicamente sobre estos importes adicionales.'],
    keywords: ['deuda principal', 'multas', 'recargos', 'importe'],
  },
  {
    id: 'quita-no-elimina-deuda', category: 'general', question: '¿La quita significa que se elimina toda la deuda?',
    answer: ['No. Una quita es una reducción parcial de las multas y los recargos.', 'El porcentaje depende de la forma de pago elegida. La deuda principal se mantiene.'],
    keywords: ['quita', 'elimina', 'descuento', 'deuda'],
  },
  {
    id: 'pago-al-contado', category: 'discounts', question: '¿Qué descuento obtengo si pago al contado?',
    answer: ['El pago al contado permite obtener una quita del 70% sobre las multas y los recargos.', 'Esto significa que se paga la deuda principal completa y solamente el 30% restante de las multas y los recargos.'],
    keywords: ['contado', '70%', 'descuento', 'quita'],
  },
  {
    id: 'entrega-y-dos-cuotas', category: 'discounts', question: '¿Qué opción existe si puedo realizar una entrega y pagar el resto en hasta 2 cuotas?',
    answer: ['Podés realizar una entrega inicial equivalente al 30% del total regularizado después de la quita y financiar el saldo en una o dos cuotas mensuales.', 'Esta modalidad tiene una quita del 60% sobre las multas y los recargos.'],
    keywords: ['entrega inicial', '30%', '2 cuotas', '60%'],
  },
  {
    id: 'entrega-y-plan-largo', category: 'discounts', question: '¿Qué opción existe si necesito más cuotas?',
    answer: ['Podés realizar una entrega inicial equivalente al 30% del total regularizado después de la quita y financiar el saldo:', 'Esta modalidad tiene una quita del 50% sobre las multas y los recargos.'],
    bullets: ['En hasta 36 cuotas mensuales.', 'En hasta 12 pagos trimestrales.'],
    keywords: ['más cuotas', '36 cuotas', '12 pagos', '50%', 'entrega inicial'],
  },
  {
    id: 'financiacion-sin-entrega', category: 'discounts', question: '¿Puedo financiar sin realizar una entrega inicial?',
    answer: ['Sí. El régimen permite financiar el importe regularizado sin una entrega inicial obligatoria:', 'Esta modalidad tiene una quita del 40% sobre las multas y los recargos.'],
    bullets: ['En hasta 36 cuotas mensuales.', 'En hasta 12 pagos trimestrales.'],
    keywords: ['sin entrega', 'financiar', '36 cuotas', '40%'],
  },
  {
    id: 'mayor-descuento', category: 'discounts', question: '¿Qué opción ofrece el mayor descuento?',
    answer: ['Dentro del régimen general, el pago al contado ofrece la mayor quita: 70% sobre multas y recargos.', 'Existe una quita especial del 80% para inmuebles destinados a vivienda propia, pero requiere documentación y la intervención del Tribunal de Quitas y Esperas.'],
    keywords: ['mayor descuento', '70%', '80%', 'contado', 'vivienda propia'],
  },
  {
    id: 'descuento-por-menos-cuotas', category: 'discounts', question: '¿El descuento aumenta si elijo menos cuotas?',
    answer: ['El descuento depende de la modalidad elegida, no de elegir una cuota menos dentro de una misma modalidad.', 'Por ejemplo, la modalidad con entrega inicial y saldo de hasta 2 cuotas mantiene una quita del 60%, tanto si se elige una como dos cuotas.'],
    keywords: ['menos cuotas', 'descuento', '60%', 'una cuota'],
  },
  {
    id: 'quita-no-ajusta-ipc', category: 'discounts', question: '¿Luego de la quita mi deuda se ajusta por IPC?',
    answer: ['No. El beneficio de la quita no se reajusta por IPC ni queda atado a la inflación. Una vez formalizado el convenio, el monto determinado al aplicar la quita se mantiene estable en el tiempo.', 'Esto no significa que todas las cuotas sean fijas en pesos: si financiás el saldo, este se expresa en Unidades Indexadas y su equivalente en pesos puede variar.'],
    keywords: ['IPC', 'inflación', 'quita', 'monto estable', 'Unidades Indexadas'],
  },
  {
    id: 'calculo-entrega-inicial', category: 'discounts', question: '¿Cómo se calcula la entrega inicial del 30%?',
    answer: ['Primero se aplica la quita correspondiente sobre las multas y los recargos. Luego se suma la deuda principal completa para obtener el total regularizado.', 'La entrega inicial mínima equivale al 30% de ese total regularizado. Por lo tanto, no se calcula sobre la deuda original antes de aplicar la quita.', 'Si la deuda original es de $ 10.000 y, después de aplicar la quita, el total regularizado queda en $ 7.000, la entrega mínima será de $ 2.100.'],
    keywords: ['entrega inicial', '30%', 'total regularizado', 'después de la quita'],
  },
  {
    id: 'hasta-36-cuotas', category: 'installments', question: '¿Qué significa “hasta 36 cuotas”?',
    answer: ['Significa que podés elegir una cantidad de cuotas mensuales entre 1 y 36.', 'No es obligatorio utilizar las 36 cuotas. La cantidad dependerá de la opción que elijas al formalizar el convenio.'],
    keywords: ['36 cuotas', 'mensuales', 'cantidad'],
  },
  {
    id: 'hasta-12-pagos-trimestrales', category: 'installments', question: '¿Qué significa “hasta 12 pagos trimestrales”?',
    answer: ['Significa que podés elegir entre 1 y 12 pagos, realizando un pago cada tres meses.', 'No equivale a 12 cuotas mensuales. Son pagos con frecuencia trimestral.'],
    keywords: ['12 pagos', 'trimestrales', 'cada tres meses'],
  },
  {
    id: 'primera-cuota', category: 'installments', question: '¿Cuándo vence la primera cuota?',
    answer: ['La primera cuota vence a los 30 días de la firma del convenio.'],
    keywords: ['primera cuota', '30 días', 'vencimiento'],
  },
  {
    id: 'unidades-indexadas', category: 'installments', question: '¿Qué significa que el saldo se convierta a Unidades Indexadas?',
    answer: ['Significa que el saldo financiado se expresa en Unidades Indexadas al momento de firmar el convenio.', 'Como el valor de la Unidad Indexada cambia, el importe en pesos de las cuotas futuras puede variar. Por eso, las cuotas mostradas por el simulador son estimativas.'],
    keywords: ['unidades indexadas', 'ui', 'saldo financiado', 'cuotas'],
  },
  {
    id: 'cuotas-no-fijas', category: 'installments', question: '¿El valor de las cuotas queda fijo el día de la simulación?',
    answer: ['No necesariamente. El simulador muestra una estimación en pesos.', 'Cuando se formalice el convenio, el saldo financiado será convertido a Unidades Indexadas. El importe final dependerá del valor aplicable en ese momento.'],
    keywords: ['cuotas fijas', 'simulación', 'unidad indexada', 'pesos'],
  },
  {
    id: 'vivienda-propia', category: 'housing', question: '¿Qué beneficio existe si el inmueble es mi vivienda propia?',
    answer: ['Quienes acrediten que el inmueble se destina a su propia vivienda pueden acceder a una quita del 80% sobre las multas y los recargos.', 'La deuda principal continúa siendo exigible.'],
    keywords: ['vivienda propia', '80%', 'inmueble', 'beneficio'],
  },
  {
    id: 'vivienda-propia-aprobacion', category: 'housing', question: '¿El descuento del 80% se aplica automáticamente?',
    answer: ['No. El beneficio debe solicitarse y está sujeto a acreditación y evaluación.', 'La simulación puede mostrar el posible resultado, pero no significa que el beneficio ya haya sido aprobado.'],
    keywords: ['80%', 'automático', 'aprobación', 'vivienda'],
  },
  {
    id: 'documentacion-vivienda-propia', category: 'housing', question: '¿Qué debo presentar para acreditar vivienda propia?',
    answer: ['Se debe presentar:', 'La documentación será analizada por el Tribunal de Quitas y Esperas.'],
    bullets: ['Una declaración jurada firmada por el contribuyente.', 'Documentos públicos que acrediten que el inmueble se utiliza como vivienda propia, por ejemplo, recibos de UTE, ANTEL u OSE.'],
    keywords: ['documentación', 'declaración jurada', 'documentos públicos', 'vivienda propia', 'UTE', 'ANTEL', 'OSE'],
  },
  {
    id: 'plazo-vivienda-propia', category: 'housing', question: '¿Cuánto demora la resolución sobre vivienda propia?',
    answer: ['El Tribunal de Quitas y Esperas dispone de un plazo máximo de 60 días desde la presentación para expedirse sobre la solicitud.'],
    keywords: ['60 días', 'resolución', 'tribunal', 'vivienda'],
  },
  {
    id: '80-no-acumulable', category: 'housing', question: '¿El 80% se suma a los demás descuentos?',
    answer: ['No. La quita del 80% es el porcentaje especial aplicable al régimen de vivienda propia.', 'No se suma al 70%, 60%, 50% o 40% de las modalidades generales.'],
    keywords: ['80%', 'suma', 'acumula', 'descuentos'],
  },
  {
    id: 'incumplimiento-dos-cuotas', category: 'agreements', question: '¿Qué ocurre si dejo de pagar un convenio de hasta 2 cuotas?',
    answer: ['El incumplimiento de uno de los pagos provoca que el convenio quede sin efecto.', 'La Intendencia podrá continuar las acciones correspondientes para recuperar la deuda.'],
    keywords: ['incumplimiento', '2 cuotas', 'convenio', 'sin efecto'],
  },
  {
    id: 'incumplimiento-mensual', category: 'agreements', question: '¿Qué ocurre si dejo de pagar un convenio mensual largo?',
    answer: ['El convenio queda sin efecto si se incumplen 4 cuotas mensuales consecutivas.'],
    keywords: ['incumplimiento', '4 cuotas', 'mensuales', 'convenio'],
  },
  {
    id: 'incumplimiento-trimestral', category: 'agreements', question: '¿Qué ocurre si dejo de pagar un convenio trimestral?',
    answer: ['El convenio queda sin efecto si se incumplen 2 pagos trimestrales consecutivos.'],
    keywords: ['incumplimiento', '2 pagos', 'trimestrales', 'convenio'],
  },
  {
    id: 'informacion-crediticia', category: 'agreements', question: '¿Puede informarse el incumplimiento a registros crediticios?',
    answer: ['Sí. El decreto establece que el incumplimiento puede comunicarse a las bases de información crediticia a las que esté afiliada la Intendencia.', 'También pueden iniciarse las acciones judiciales correspondientes.'],
    keywords: ['registros crediticios', 'información crediticia', 'incumplimiento'],
  },
  {
    id: 'convenios-2025', category: 'agreements', question: '¿Puedo reliquidar un convenio firmado durante 2025?', note: 'Esta situación puede requerir atención personalizada y no necesariamente forma parte del simulador general.',
    answer: ['Puede solicitarse la reliquidación de convenios de Contribución Inmobiliaria Urbana o Suburbana firmados durante 2025, siempre que continúen vigentes y estén al día cuando entre en vigor el decreto.', 'Para el nuevo cálculo se descuenta lo que ya fue pagado y el saldo restante puede regularizarse mediante las modalidades previstas.'],
    keywords: ['2025', 'convenio', 'reliquidar', 'vigente'],
  },
  {
    id: 'resultado-estimado', category: 'simulator', question: '¿El resultado del simulador es definitivo?',
    answer: ['No. El resultado es una estimación realizada con los importes y condiciones disponibles en el momento de la simulación.', 'La liquidación definitiva será realizada por la Intendencia al formalizar el trámite.'],
    keywords: ['resultado estimado', 'definitivo', 'simulador', 'liquidación'],
  },
  {
    id: 'resultado-cambia-otro-dia', category: 'simulator', question: '¿Por qué el resultado puede cambiar otro día?',
    answer: ['La deuda puede variar por la actualización de multas, recargos y otros valores aplicables.', 'Además, cuando existe financiación, el saldo se convierte a Unidades Indexadas al momento de firmar el convenio. Por eso, una simulación realizada hoy puede ser diferente del cálculo definitivo efectuado más adelante.'],
    keywords: ['cambiar', 'otro día', 'multas', 'recargos', 'ui'],
  },
  {
    id: 'simulacion-no-congela-deuda', category: 'simulator', question: '¿La simulación congela mi deuda?',
    answer: ['No. La simulación no congela la deuda, no reserva un descuento y no sustituye la liquidación oficial.', 'El resultado corresponde únicamente a los datos utilizados el día en que se realiza.'],
    keywords: ['congela', 'deuda', 'reserva', 'liquidación oficial'],
  },
  {
    id: 'datos-del-simulador', category: 'simulator', question: '¿Qué datos debo ingresar en el simulador?',
    answer: ['Debés ingresar:', 'La quita se calculará solamente sobre las multas y los recargos.'],
    bullets: ['La deuda tributaria principal.', 'Las multas.', 'Los recargos.'],
    keywords: ['datos', 'ingresar', 'deuda principal', 'multas', 'recargos'],
  },
  {
    id: 'importes-correctos', category: 'simulator', question: '¿Dónde obtengo los importes correctos?',
    answer: ['Los importes deben obtenerse de la información oficial proporcionada por la Intendencia.', 'Si no conocés la separación entre deuda principal, multas y recargos, consultá antes de utilizar el simulador para evitar un resultado incorrecto.'],
    keywords: ['importes', 'información oficial', 'intendencia'],
  },
  {
    id: 'simulacion-no-garantiza', category: 'simulator', question: '¿La simulación garantiza que se aprobará el convenio?',
    answer: ['No. La simulación sirve para orientar y comparar alternativas.', 'La aprobación, la liquidación definitiva y la firma del convenio corresponden a la Intendencia.'],
    keywords: ['garantiza', 'aprobación', 'convenio', 'simulación'],
  },
  {
    id: 'tribunal-de-quitas-y-esperas', category: 'deadlines', question: '¿Qué es el Tribunal de Quitas y Esperas?',
    answer: ['Es un órgano integrado por tres miembros que analiza situaciones especiales y las solicitudes relacionadas con vivienda propia.', 'Para tomar una decisión puede considerar la situación económica y social del contribuyente, el destino y las condiciones de la vivienda y otros antecedentes relevantes.'],
    keywords: ['tribunal', 'quitas y esperas', 'vivienda propia'],
  },
  {
    id: 'tribunal-pide-informacion', category: 'deadlines', question: '¿El Tribunal puede pedirme más información?',
    answer: ['Sí. El Tribunal puede solicitar más datos o documentos y también puede disponer una inspección del inmueble cuando sea necesario para resolver la solicitud.'],
    keywords: ['tribunal', 'documentos', 'inspección', 'información'],
  },
  {
    id: 'documentacion-no-presentada', category: 'deadlines', question: '¿Qué pasa si no presento la documentación solicitada?',
    answer: ['La solicitud puede considerarse desistida si la persona no se presenta luego de ser citada, no entrega la documentación requerida dentro del plazo o impide una inspección dispuesta por el Tribunal.'],
    keywords: ['documentación', 'solicitud', 'tribunal', 'inspección'],
  },
  {
    id: 'consultas-no-contempladas', category: 'deadlines', question: '¿Dónde puedo consultar si mi caso no aparece aquí?',
    answer: ['Si tu situación no está contemplada en estas preguntas, consultá directamente con la Intendencia antes de tomar una decisión o firmar un convenio.', 'La atención personalizada permitirá verificar los importes, la documentación y la modalidad aplicable a tu caso.'],
    keywords: ['consultas', 'caso', 'intendencia', 'atención personalizada'],
  },
]);
