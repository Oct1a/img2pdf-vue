const fs = require('fs');
const $path = require('path');

//获取当前图片的格式
const isImage = str => {
  var reg = /\.(png|jpg|gif|jpeg|webp)$/;
  return reg.test(str);
}


// {
//   "code": "convert",
//   "explain": "图片转PDF",
//   "cmds": [{
//       "type": "files",
//       "label": "转为PDF格式",
//       "fileType": "file",
//       "match": "/.(png|jpg|gif|jpeg|webp)$/",
//       "minNum": 1
//   },"pdf"]
// }, {
//   "code": "convert_merge",
//   "explain": "多张图片合成PDF",
//   "cmds": [{
//       "type": "files",
//       "label": "多张图合成PDF",
//       "fileType": "file",
//       "match": "/.(png|jpg|gif|jpeg|webp)$/",
//       "minNum": 2
//   }]
// }

// 图片转为Base64
// const getImageBase64 = (imgPath, fileName) => {
//   let data = fs.readFileSync(imgPath, 'binary')
//   const buffer = new Buffer(data, 'binary');
//   let img64 = 'data: image/' + getImageType(fileName) + ';base64,' + buffer.toString('base64');
//   return img64 || ""
// }


window.exports = {
  "showHome":{
    mode:"none",
    args:{
      enter:()=>{
        const ubWindow = utools.createBrowserWindow('index.html', {
          show: false,
          title: '测试窗口',
          webPreferences: {
            preload: 'preload.js'
          }
        }, () => {
          // 显示
          ubWindow.show()
          // 置顶
          // ubWindow.setAlwaysOnTop(true)
          // 窗口全屏
          // ubWindow.setFullScreen(true)
          // 向子窗口传递数据
          // ubWindow.webContents.send('ping')
          // require('electron').ipcRenderer.sendTo(ubWindow.webContents.id, 'ping')
          // 执行脚本
          // ubWindow.executeJavaScript('fetch("https://jsonplaceholder.typicode.com/users/1").then(resp => resp.json())')
          //   .then((result) => {
          //     console.log(result) // Will be the JSON object from the fetch call
          //   })
        })
      }
    }
  },
  //单张图片转为pdf
  "convert": {
    mode: "none",
    args: {
      enter: (action, callbackSetList) => {
        // utools.hideMainWindow()
        // let files = action.payload
        //   // 遍历选中文件
        // for (const element of files) {
        //   if (element.isFile) {
        //     let { name, path } = element
        //     let img64 = getImageBase64(path, name)
        //     // imagePdf([{
        //     //   data: img64
        //     // }], name.slice(0, name.lastIndexOf('.')))
        //   }
        // }
        // utools.showNotification('转换完成！')
      }
    }
  },
  // "convert_merge": {
  //   mode: "none",
  //   args: {
  //     enter: (action, callbackSetList) => {
  //       utools.hideMainWindow()
  //       let files = action.payload
  //       let images = []
  //         // 遍历选中文件
  //       for (const element of files) {
  //         if (element.isFile) {
  //           let { name, path } = element
  //           let img64 = getImageBase64(path, name)
  //           images.push({
  //             data: img64
  //           })
  //         }
  //       }
  //       imagePdf(images, new Date().getTime())
  //       utools.showNotification('转换合并完成！')
  //     }
  //   }
  // }
}