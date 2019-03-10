const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

// create express object
const app = express();

// set ejs as our view engine
app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// start up server and routing
app
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.render('pages/index'))
  .get('/getRate', handlePostageRate)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));



// This function will calculate the postal rate
function calculateRate(mailType, weight, handleResult) {

  console.log(`You selected: ${mailType} at a weight of ${weight} lbs.`);
  var cost;

  switch (mailType) {
    case 'letterStamp':
      if (weight <= 1) {
        cost = 0.55;
      } else if (weight <= 2) {
        cost = 0.70;
      } else if (weight <= 3) {
        cost = 0.85;
      } else if (weight <= 3.5) {
        cost = 1;
      } else {
        cost = 1;
      }
      mailType = 'Letter (Stamped)';
      break;
    case 'letterMetered':
      if (weight <= 1) {
        cost = 0.50;
      } else if (weight <= 2) {
        cost = 0.65;
      } else if (weight <= 3) {
        cost = 0.80;
      } else if (weight <= 3.5) {
        cost = 0.95;
      } else {
        cost = 0.95;
      }
      mailType = 'Letter Metered';
      break;
    case 'largeEnvelopes':
      cost = 1;
      if (weight > 1) {
        cost += weight * 0.15;
      }
      mailType = 'Large Envelopes (Flats)';
      break;
    case 'firstClass':
      // Zone one prices
      if (weight <= 4) {
        cost = 3.66;
      } else if (weight <= 8) {
        cost = 4.39;
      } else if (weight <= 12) {
        cost = 5.19;
      } else if (weight <= 14) {
        cost = 5.71;
      } else {
        cost = 5.71;
      }
      mailType = 'First-Class Package Service—Retail';
      break;
  }

  params = {
    mailType: mailType,
    weight: weight,
    cost: cost
  };

  handleResult(params);
}

function handlePostageRate(request, response) {
  console.log("Get those rates!");

  const mailType = request.query.mailType;
  console.log("Mail Type: " + mailType);

  const weight = request.query.weight;
  console.log("Weight: " + weight);

  calculateRate(mailType, weight, function(params) {
      response.render('pages/postal_rate_result', params);
  });
}