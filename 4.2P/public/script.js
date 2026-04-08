const getStations = () => {
  $.get('/api/stations', (response) => {
    if (response.statusCode !== 200) return
    const stationImageSrc = (station) => {
      const name = (station.stationName || '').toLowerCase()
      if (name.includes('melbourne central')) return '/images/melbourne-central.jpg'
      if (name.includes('southbank')) return '/images/southbank.jpg'
      if (name.includes('richmond')) return '/images/richmond.jpg'
      return '/images/melbourne-central.jpg'
    }

    const addCards = (stations) => {
      stations.forEach((station) => {
        const card = `
			<div class="col s12 m4">
				<div class="card">
        <div class="card-image">
          <img class="materialboxed" src="${stationImageSrc(station)}" alt="${station.stationName || 'Station'}" />
        </div>
				<div class="card-content">
					<span class="card-title">${station.stationName}</span>
					<p>${station.suburb}</p>
					<p>Connector: ${station.connectorType}</p>
					<p>Power: ${station.powerOutput} kW</p>
					<p>Status: ${station.available ? 'Available' : 'In Use'}</p>
				</div>
				</div>
			</div>`
        $('#card-container').append(card)
      })
      $('.materialboxed').materialbox()
    }
    addCards(response.data || [])
  })
}

function submitForm () {
  // Wire to POST /api/stations when the server exposes a create route.
}

$(document).ready(function () {
  $('#formSubmit').click(() => {
    submitForm()
  })
  getStations()
  $('.modal').modal()
})
