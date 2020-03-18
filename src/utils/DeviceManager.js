// /**
//  * 연결된 모든 장치 리스트를 가져온다.
//  * @returns {Promise<MediaDeviceInfo[]>} 장치 리스트
//  */
// export async function getDevices() {
//   const devices = await navigator.mediaDevices.enumerateDevices();
//   return devices;
// }

 /**
  * Dropdown Options 속성을 위해 장치 리스트를 만든다.
  * @param {String} kind videoinput || audioinput || audiooutput
  */
export async function createDeviceOptions(kind) {
  try {

    // 연결된 모든 장치 리스트를 가져온다.
    // const devices = await getDevices();
    const devices = await navigator.mediaDevices.enumerateDevices();
    var videoDeviceCount = 0;
    var options = [];

    devices.forEach(device => {
      if (device.kind === kind) {
        options.push({
          key: device.deviceId,
          value: videoDeviceCount,
          text: device.label,
        });
        videoDeviceCount++;
      }
    });
    return options;
  } catch (e) {
    console.log(e.name + ': ' + e.message);
    return e;
  }
}

/**
 * 카메라 스트림을 가져온다.
 * @param {Object} constraints
 */
export async function getStream(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (e) {
    console.log(e.name + ': ' + e.message);
    return e;
  }
}

/**
 * 카메라 스트림을 중지한다.
 * @param {Element} videoElement
 */
export function stopStream(videoElement) {
  let stream = videoElement.srcObject;

  if (stream !== null && stream !== undefined) {
    let tracks = stream.getTracks();

    tracks.forEach(track => {
      track.stop();
    });
  }

  videoElement.srcObject = null;
}
