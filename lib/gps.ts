navigator.geolocation.watchPosition(
  (position) => {
    console.log(position.coords.latitude)
    console.log(position.coords.longitude)
  }
)