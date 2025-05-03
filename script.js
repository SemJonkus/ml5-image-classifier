const classifier = ml5.imageClassifier('MobileNet', () => {
    console.log('Model geladen!');
    const image = document.getElementById('image');
    classifier.classify(image, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      const result = results[0];
      document.getElementById('result').innerText =
        `Label: ${result.label}, Confidence: ${(result.confidence * 100).toFixed(2)}%`;
    });
  });
  