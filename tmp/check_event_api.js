
const eid = 116; // From the screenshot
const url = `http://localhost:3001/community/get-event-page/${eid}`; // Assuming backend is on 3001

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log('API Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('API Error:', err);
  });
