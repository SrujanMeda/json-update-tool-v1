// src/utils/fieldMapping.js

const fieldMapping = {
  id: "externalId",
  country_code: ["market", "countryCode"],
  language_code: ["language", "languageCode"],
  first_name: "consumer.firstName",
  last_name: "consumer.surname",
  email: ["consumer.emailAddress[0].value", "consumer.emailAddresses[0].value"],
  post_code: "consumer.address.postalCodeNumber",
  phone_number: "consumer.phoneNumbers[0].value",
  campaign_code: "opportunity.campaignCode",
  model: "opportunity.productOfInterests[0].vehicle.model",
  product_name: "opportunity.productOfInterests[0].vehicle.productName",
  parma_partner_code: "opportunity.retailer.parmaPartnerCode",
};

export default fieldMapping;
