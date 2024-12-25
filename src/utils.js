export function clearCookies() {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i += 1) {
    document.cookie = cookieArr[i] + "; expires=" + new Date().toUTCString();
  }
}

export function getCookie(key) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i += 1) {
    if (cookieArr[i].split("=")[0] == key) {
      return cookieArr[i];
    }
  }
}

export function getCookieValue(key) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i += 1) {
    if (cookieArr[i].split("=")[0] == key) {
      return cookieArr[i].split("=")[1];
    }
  }
}

export function clearCookie(key) {
  document.cookie = getCookie(key) + "; expires=" + new Date().toUTCString();
}

// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export function parseJwt(token) {
  var splitToken = token.split(".");

  if (splitToken.length !== 3) {
    console.error("invalid json");
    return {};
  }
  var base64Url = splitToken[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


export function shortenAddress(
  address,
  length = 8,
  ellipsis = "...",
  ethereum = false
) {
  if (address == undefined) {
    return "";
  }
  let addressNormalized = address.split("0x");
  addressNormalized = addressNormalized[addressNormalized.length - 1];

  let addr = ethereum ? "0x" : "";
  let half_length = length / 2;
  if (parseInt(half_length) !== half_length) {
    // odd; UNTESTED
    for (let i = 0; i < parseInt(half_length); i += 1) {
      addr += addressNormalized[i];
    }
    addr += ellipsis;
    for (let i = 0; i < Math.round(half_length); i += 1) {
      addr += addressNormalized[addressNormalized.length - i + 1];
    }
    return addr;
  } else {
    // even
    for (let i = 0; i < half_length; i += 1) {
      addr += addressNormalized[i];
    }
    addr += ellipsis;
    for (let i = 0; i < half_length; i += 1) {
      addr += addressNormalized[addressNormalized.length - half_length + i];
    }
    return addr;
  }
}