

/**
 * base64图片转其他格式
 * @param {*} base64 
 * @param {*} format 
 * @returns 
 */
export function base64FromRaster(base64, format){
  return new Promise((resolve, reject) => {
      let canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let img = new Image();
      img.crossOrigin = "Anonymous"; //开启img的“跨域”模式
      img.src = base64;
      img.onload = function() {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0, img.width, img.height); //参数可自定义
          const dataURL = canvas.toDataURL("image/" + (format || 'png'),1); //获取Base64编码
          resolve({result:dataURL});
          canvas = null; //清除canvas元素
          img = null; //清除img元素
      };
      img.onerror = function() {
          reject(new Error("Could not load image at " + url));
      };
  });
}

/**
 * 图片对象转base64格式
 * @param {*} file 
 * @returns 
 */
export function raw2base64(file) { 
    return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onerror = function(error) {
            reject(error);
        };
        reader.onloadend = function() {
            resolve(reader);
        };
    });
}

/**
 * 根据base64头判断图片类型，是否是jpg/jpeg/png
 * @param {*} fileBase64 
 * @returns 
 */
export function base64FileHeaderMapper(fileBase64) {
    //获取不同文件的文件头前3个字作为判断依据
    let drawBase64 = /base64,(.{3})/.exec(fileBase64)
    let fileHeader = drawBase64[1]

    return fileHeader === "/9j" || fileHeader === "iVB"
}


// 单位换算,毫米换算为英寸
export function unitConverter(size){
    return ((size* 0.001) * 39.370078740157).toFixed(2)*72
}
// 像素换算英寸,72像素
export function px2inch(px){
    return px/72
}