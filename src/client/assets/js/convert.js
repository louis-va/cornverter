(() => {
  const form = document.getElementById('form')
  const resultContainer = document.getElementById('result')

  function displayResult(data) {
    resultContainer.classList.remove('loading')
    let result = data.toFixed(2)
    let resultArray = result.toString().split(".")
    resultContainer.innerHTML = `${resultArray[0]} <span class='decimal'>,${resultArray[1]}</span>`
  }

  function getCornAmout(usd) {
    if(!usd || !Number(usd)) return null // validation

    resultContainer.innerHTML = "–"
    resultContainer.classList.add('loading')

    const data = { usd }
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    fetch('./api/corn-amount/', options)
      .then(response => response.json())
      .then(data => {displayResult(data.data.cornAmount)})
      .catch((error) => {console.error(error)})
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(form)
    getCornAmout(formData.get('usd'))
  };
})();