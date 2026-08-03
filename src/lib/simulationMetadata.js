export const SIMULATION_DATE_NOTICE = 'Importante: esta simulación refleja una estimación calculada con los importes y condiciones correspondientes al día en que se realiza. El resultado no congela la deuda ni constituye una liquidación definitiva.\n\nSi el convenio se formaliza en una fecha posterior, el monto final puede variar debido a la generación o actualización de multas y recargos, la conversión del saldo a Unidades Indexadas y cualquier otra actualización que corresponda.\n\nEl importe definitivo será el determinado oficialmente por la Intendencia en la fecha de liquidación y suscripción del convenio.';

export const SIMULATION_RESULT_NOTICE = 'Resultado estimado para la fecha de esta simulación. El importe definitivo puede variar si la liquidación o suscripción del convenio se realiza posteriormente.';

export function createSimulationSnapshot(debt, simulationDate = new Date()) {
  if (!(simulationDate instanceof Date) || Number.isNaN(simulationDate.getTime())) {
    throw new Error('La fecha de simulación es inválida.');
  }
  return { debt, simulationDate: new Date(simulationDate.getTime()) };
}

export function formatSimulationDate(simulationDate) {
  if (!(simulationDate instanceof Date) || Number.isNaN(simulationDate.getTime())) {
    throw new Error('La fecha de simulación es inválida.');
  }
  const day = String(simulationDate.getDate()).padStart(2, '0');
  const month = String(simulationDate.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${simulationDate.getFullYear()}`;
}
