const toTimeString = (sec, showMilliSeconds = true) => {
  sec = parseFloat(sec);
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  let maltissaRegex = /\..*$/; // matches the decimal point and the digits after it e.g if the number is 4.567 it matches .567

  let millisec = String(seconds).match(maltissaRegex);
  return (
    hours +
    ":" +
    minutes +
    ":" +
    String(seconds).replace(maltissaRegex, "") +
    (showMilliSeconds ? (millisec ? millisec[0] : ".000") : "")
  );
};

const timeStringToSec = (timeString) => {
  let timeSections = timeString.split(':');

  let hours = parseInt(timeSections[0])*3600;
  let minutes = parseInt(timeSections[1])*60;
  let seconds = parseInt(timeSections[2]);

  return (hours+minutes+seconds);
}

const getStartEnd = (fileName) => {
  let fns = fileName.split('_');
  let fLen = fns.length;

  let endTime = `${fns[fLen-3]}:${fns[fLen-2]}:${fns[fLen-1]}`

  let startTime = `${fns[fLen-6]}:${fns[fLen-5]}:${fns[fLen-4]}`

  return [startTime,endTime]
}

const readFileAsBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const download = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  link.click();
};

export { toTimeString, readFileAsBase64, download, getStartEnd, timeStringToSec };
