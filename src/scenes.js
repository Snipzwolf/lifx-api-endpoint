/*
option	type	default	description
hue	int		Between 0 and 360, representing the color hue in degree which changes the color.
saturation	int		Between 0 and 100, representing the color intensity from 0% to 100%.
brightness	int		Between 0 and 100, representing the light brightness from 0% to 100%.
kelvin	int	3500	Between 2500 and 9000, representing the color temperature.
duration	int	0	Fade the color to the new value over time (in milliseconds).
callback	function	null	function(error) {} Called after the command has reached the light or after client.resendMaxTimes with client.resendPacketDelay in case it has not. error is null in case of success and given if the sending has failed.
*/
module.exports = {
  'night': [118, 10, 19, 2500, 2000],
  'bright': [118, 0, 100, 9000, 2000],
  'red': [360, 74, 100, 9000, 2000],
  'green': [119, 74, 100, 9000, 2000],
  'blue': [160, 74, 100, 9000, 2000]
};
