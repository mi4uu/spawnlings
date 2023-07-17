const input1 = await Bun.file( '/Users/zeno/Documents/production.Chargebacks.json' ).json()
const input2 = await Bun.file( '/Users/zeno/Documents/production.ChargebacksToRename.json' ).json()

const input = [
  ...input1,
  ...input2.map( ( c ) => {
    c.chargeback_id = c.chargebackDataId
    return c
  } ),
]

const responses = await Bun
  .file( '/Users/zeno/Projects/spawnlings/configlings/macos_config/fliziarz-feliks/src/responses.json' )
  .json()

const extraData = await Bun.file( '/Users/zeno/Downloads/csvjson.json' ).json()
const responsesWithNoChargeback = responses
  .filter(( response ) => !response.chargeback_id || response.chargeback_id === 'N/A')
  .map(( response ) => response.response)
const getRandomDate = () => {
  const currentDate = new Date()
  const futureDate = new Date()

  // Set the minimum date to 1 month from now
  futureDate.setMonth( currentDate.getMonth() + 1 )

  // Set the maximum date to 3 months from now
  futureDate.setMonth( currentDate.getMonth() + 3 )

  // Generate a random timestamp between the minimum and maximum dates
  const randomTimestamp = currentDate.getTime() + Math.random() * (futureDate.getTime() - currentDate.getTime())

  // Create a new Date object from the random timestamp
  const randomDate = new Date( randomTimestamp )

  return randomDate
}
const extraResponses = [
  ...responsesWithNoChargeback,
  '',
  'No evidence found of unauthorized transaction. Please provide additional proof for further investigation.',
  'Cardholder confirmed transaction validity. Dispute not substantiated.',
  'Insufficient proof of benefit provided. Unable to validate claim.',
  'Lack of supporting documentation hinders investigation progress. Please provide necessary records.',
  "Inadequate links to cardholder's account. Unable to establish connection to transaction.",
  "No record of cancellation policy acceptance. Merchant's cancellation terms unclear.",
  '',
  'Cardholder claims non-receipt of services. Insufficient evidence to support the claim.',
  'Missing information for claim validation. Please provide complete details.',
  'Failed to provide required documents to support dispute. Investigation pending necessary evidence.',
  "Dispute not resolved by merchant. Cardholder's claim remains unresolved.",
  'No proof of cardholder acceptance of terms. Lack of documented agreement.',
  'Proper disclosure not provided at the time of transaction. Insufficient evidence of cancellation policy.',
  'Inadequate evidence provided to validate dispute. Additional supporting documents required.',
  'Cardholder disputes the charge and denies authorization. Further investigation needed.',
  "No resolution reached with the merchant despite cardholder's attempts. Dispute remains unresolved.",
  "Cardholder claims cancellation of services. Merchant's records do not reflect cancellation.",
  'Limited cancellation policy not disclosed to cardholder. Lack of documented agreement.',
  'Missing cardholder signature on necessary documents. Unable to verify acceptance of terms.',
  "Merchant's rebuttal lacks convincing evidence. Dispute requires further examination.",
  'No proof of cardholder agreement to the transaction. Insufficient evidence to validate claim.',
  'Sorry, but no match found in our records for Cardholder Last Name. Please provide accurate information for further assistance.',
  "I talked to the cardholder and they say they didn't authorize the transaction and didn't use our service to make a payment.",
  'The issuer said, "The merchant didn\'t show proof of benefit. Our center certified this as an unauthorized transaction.',
  '2nd CB A-RTM. Please provide additional details to proceed with the investigation.',
  'The issuer said, "Not enough links or compelling evidence to connect the transaction to the cardholder.',
  'We have documents in the portal. Please review them for more information regarding the dispute.',
  'Insufficient evidence to prove the customer received or benefited from the transaction. Re-certifying claim. Please accept our pre-arbitration response.',
  "The issuer filed pre-arbitration because the dispute hasn't been resolved. The cardholder reviewed the merchant's rebuttal and continues to deny the charge. The services were supposedly canceled on 04/11/2022. The merchant provided internal documents but failed to provide any record proving a properly disclosed limited cancellation policy at the time of purchase. The cardholder never agreed or accepted any cancellation policy. The merchant didn't provide documentation showing the cardholder accepted or signed their limited cancellation policy. Per Visa, the merchant can't bill for undisclosed cancellation fees. The merchant's documentation clearly shows the limited cancellation policy wasn't provided during payment. Proper disclosure is lacking. The cardholder tried to resolve with the merchant multiple times, but no resolution was reached. Please credit our mutual customer. We hope for a favorable outcome before our filing date.",
  "The merchant didn't provide documentation showing the cardholder accepted or signed their limited cancellation policy. Per Visa, the merchant can't bill for undisclosed cancellation fees. The merchant's documentation clearly shows the limited cancellation policy wasn't provided during payment. Proper disclosure is lacking. The cardholder tried to resolve with the merchant multiple times, but no resolution was reached. Please credit our mutual customer. We hope for a favorable outcome before our filing date.",
]
  .sort(() => Math.random() - 0.5)

let extraMappedCOunt = 0
const chargebacks = input
  .map( ( chargeback ) => {
    const response = responses.find(( r ) => r.chargeback_id === chargeback.chargeback_id)?.response
      || extraResponses.pop()
    return ({
      ...chargeback,
      state: { ...(chargeback.state || {}), issuerResponse: response, dueDate: getRandomDate() },
      lifecycleStage: 'second_chargeback',
      internal: { ...chargeback.internal, status: 1 },
      ac_metadata: { ...(chargeback.ac_metadata || {}), handlingChargebacksType: 'internal' },
    })
  } )
  .map( ( chargeback ) => {
    const ed = extraData.find(( r ) => r.chargeback_id === chargeback.chargeback_id)
    if ( ed ) {
      extraMappedCOunt += 1
      chargeback['refunded'] = ed['chargeback.refunded']
      if ( !chargeback['transaction']['order'] ) {
        chargeback['transaction']['order'] = {}
      }
      if ( !chargeback['transaction']['order']['items'] ) {
        chargeback['transaction']['order']['items'] = {}
      }
      chargeback['transaction']['order']['items']['productName'] = ed['transaction.order.items.productName']

      if ( !chargeback['transaction']['shipping'] ) {
        chargeback['transaction']['shipping'] = {}
      }
      if ( !chargeback['transaction']['shipping']['to'] ) {
        chargeback['transaction']['shipping']['to'] = {}
      }
      chargeback['transaction']['shipping']['to']['addressLine1'] = ed['transaction.shipping.to.addressLine1']
      chargeback['transaction']['shipping']['trackingCode'] = ed['transaction.shipping.trackingCode']

      if ( !chargeback['transaction']['proof'] ) {
        chargeback['transaction']['proof'] = {}
      }
      chargeback['transaction']['proof']['proofOfDeliveryFile'] = ed['transaction.proof.proofOfDeliveryFile']

      if ( !chargeback['transaction']['communication'] ) {
        chargeback['transaction']['communication'] = {}
      }
      chargeback['transaction']['communication']['customerSupport'] = ed['transaction.communication.customerSupport']
      chargeback['transaction']['communication']['merchantNotes'] = ed['transaction.communication.merchantNotes']
    }

    return chargeback
  } )
const ids = chargebacks.map(( c ) => c.chargeback_id)
console.log( `
count: ${chargebacks.length}
extraMapped: ${extraMappedCOunt}


  use("staging")
  db.Chargebacks.deleteMany({ chargeback_id: {$in: ${JSON.stringify( ids )}} })
  ` )

Bun.write( '/Users/zeno/Documents/000_freashly_baked_chargebacks.json', JSON.stringify( chargebacks ) )
