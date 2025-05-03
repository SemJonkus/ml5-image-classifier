
const image = document.getElementById('input-image');
const labelOutput = document.getElementById('label-output');
const ctx = document.getElementById('result-chart').getContext('2d');
let resultChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Confidence (%)',
      data: [],
      backgroundColor: 'rgba(0, 123, 255, 0.6)',
    }]
  },
  options: {
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Confidence in %'
        }
      }
    }
  }
});


const classifier = ml5.imageClassifier('MobileNet', modelReady);

function modelReady() {
  labelOutput.innerText = 'Modell bereit – warte auf Bild...';

  const image = document.getElementById('input-image');

  image.onload = () => {
    labelOutput.innerText = 'Bild geladen – klassifiziere ...';
    classifier.classify(image, gotResults);
  };

  if (image.complete && image.naturalHeight !== 0) {
    image.onload(); 
  }
}
function gotResults(err, results) {
  if (err) {
    console.error(err);
    return;
  }

  console.log(results);

  const topResults = results.slice(0, 5); 

  labelOutput.innerText = `Top Ergebnis: ${topResults[0].label} (${(topResults[0].confidence * 100).toFixed(2)}%)`;

  resultChart.data.labels = topResults.map(r => r.label);
  resultChart.data.datasets[0].data = topResults.map(r => (r.confidence * 100).toFixed(2));
  resultChart.update();
}