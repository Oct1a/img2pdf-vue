<template>
  <div class="home">
      <div class="main-container">
          <!-- 上传图片 -->
          <div class="upload-container">
              <div class="upload-area" 
                   @click="triggerFileInput"
                   @drop.prevent="handleDrop"
                   @dragover.prevent
                   @dragenter.prevent>
                  <input type="file" 
                         ref="fileInput" 
                         @change="handleFileSelect" 
                         accept=".JPG,.jpg,.JPEG,.jpeg,.PNG,.png,.GIF,.gif,.bmp,.webp" 
                         multiple 
                         style="display: none">
                  <div class="upload-placeholder">
                      <i class="el-icon-plus"></i>
                      <p>点击或拖拽文件到此处上传</p>
                  </div>
              </div>
              
              <draggable 
                  v-model="fileList" 
                  class="image-list" 
                  :animation="150"
                  ghost-class="ghost"
                  @start="drag=true" 
                  @end="drag=false"
                  :disabled="false"
                  @change="handleDragChange"
                  handle=".drag-handle">
                  <div v-for="file in fileList" 
                       :key="file.uid" 
                       class="image-item">
                      <div class="drag-handle">
                          <i class="el-icon-rank"></i>
                      </div>
                      <img :src="file.url" alt="">
                      <div class="image-actions">
                          <span class="preview-btn" @click="handlePictureCardPreview(file)">
                              <i class="el-icon-zoom-in"></i>
                          </span>
                          <span class="delete-btn" @click="handleRemove(file)">
                              <i class="el-icon-delete"></i>
                          </span>
                      </div>
                  </div>
              </draggable>
          </div>

          <!-- 操作按钮区域 -->
          <div class="fixed-buttons">
              <el-tooltip effect="dark" content="转为PDF文件" placement="left">
                  <el-button type="primary" icon="el-icon-document" circle @click="convert2pdf"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="打开设置" placement="left">
                  <el-button type="danger" icon="el-icon-s-tools" circle @click="settingDrawer = true"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="清空文件列表" placement="left">
                  <el-button type="danger" icon="el-icon-delete" circle @click="clearFileList" :disabled="fileList.length==0"></el-button>
              </el-tooltip>
          </div>
      </div>

      <!-- 图片展示 -->
      <el-dialog :visible.sync="dialogVisible" class="preview-dialog">
          <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

      <!-- 设置抽屉 -->
      <el-drawer title="设置中心" :visible.sync="settingDrawer" direction="rtl" size="50%" class="setting-drawer">
          <div style="padding: 0 2rem;">
              <!-- 自动/手动更改方向 -->
              <el-link type="danger" class="tipText" :underline="false">方向更改方式</el-link>
              <div style="text-align: center;margin:1.5rem 0;">
                  <el-switch 
                      v-model="autoDirection" 
                      active-value="1"
                      inactive-value="0"
                      active-text="自动更改" 
                      inactive-text="手动更改"
                      active-color="#13ce66"
                      inactive-color="#F56C6C">
                  </el-switch>
              </div>

              <!-- 页面方向 -->
              <el-link type="danger" class="tipText" :underline="false">选择页面方向</el-link>
              <el-row v-if="autoDirection == '0'">
                  <el-col :span="12">
                      <el-card shadow="hover" class="pageDirection" @click.native="changeDirection('portrait')" :class="{'activePage':direction == 'portrait'}">
                          <div class="vertical-box"></div>
                          <p>竖向</p>
                      </el-card>
                  </el-col>
                  <el-col :span="12">
                      <el-card shadow="hover" class="pageDirection" @click.native="changeDirection('landscape')" :class="{'activePage':direction == 'landscape'}">
                          <div class="horizontal-box"></div>
                          <p>横向</p>
                      </el-card>
                  </el-col>
              </el-row>

              <!-- 页面大小 -->
              <el-link type="danger" class="tipText" :underline="false">选择页面大小 
                  <span class="el-icon-question" @click="pageSizeVisibleTips = true"></span>
              </el-link>

              <!-- 展示图片大小提示图片 -->
              <el-dialog :visible.sync="pageSizeVisibleTips" :modal="false" width="35%" @click.native="pageSizeVisibleTips = false" top="5vh">
                  <img width="100%" :src="pageSizeTipsUrl" alt="" style="background-color: white;">
              </el-dialog>
                  
              <el-row>
                  <el-col :span="24">
                      <el-select v-model="pageSize" placeholder="请选择" style="width: 100%;">
                          <el-option-group
                          v-for="group in options"
                          :key="group.label"
                          :label="group.label">
                          <el-option v-for="item in group.options" :key="item.value" :label="item.value" :value="item.value" >
                              <span style="float: left">{{ item.value }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.width +'x'+ item.height +'mm' }}</span>
                          </el-option>
                      </el-option-group>
                      </el-select>
                  </el-col>
              </el-row>
              <el-link type="danger" class="tipText" :underline="false">页边距</el-link>
              <!-- 边距设置 -->
              <el-row>
                  <el-col :span="6" :xs="24" :sm="6">
                      <el-card shadow="hover" class="pageMargin" @click.native="changeMargin('normal')" :class="{'activePage':pageMargin == 'normal'}">
                          <img src="@/assets/img/normal.png" alt="" class="margin-custom-box">
                          <span>无边框</span>
                      </el-card>
                  </el-col>
                  <el-col :span="6" :xs="24" :sm="6">
                      <el-card shadow="hover" class="pageMargin" @click.native="changeMargin('narrow')" :class="{'activePage':pageMargin == 'narrow'}">
                          <img src="@/assets/img/narrow.png" alt="" class="margin-custom-box">
                          <span>窄边框</span>
                      </el-card>
                  </el-col>
                  <el-col :span="6" :xs="24" :sm="6">
                      <el-card shadow="hover" class="pageMargin" @click.native="changeMargin('wide')" :class="{'activePage':pageMargin == 'wide'}">
                          <img src="@/assets/img/wide.png" alt="" class="margin-custom-box">
                          <span>大边框</span>
                      </el-card>
                  </el-col>
                  <el-col :span="6" :xs="24" :sm="6">
                      <el-card shadow="hover" class="pageMargin" @click.native="changeMargin('custom')" :class="{'activePage':pageMargin == 'custom'}">
                          <img src="@/assets/img/custom.png" alt="" class="margin-custom-box-special">
                          <span>自定义</span>
                      </el-card>
                  </el-col>
              </el-row>
              <!-- 自定义边距滑块 -->
              <div class="customMargin" v-if="marginCustom">
                  <el-slider v-model="customMarginvalue" show-input :max=100>
                  </el-slider>
              </div>
              <!-- 是否合并选项 -->
              <div style="text-align: center;margin:1.5rem 0;">
                  <el-switch 
                      v-model="mergeSwitch"
                      active-value="1"
                      inactive-value="0"
                      active-text="合并成一个PDF" 
                      inactive-text="创建分离PDF文件"
                      active-color="#13ce66"
                      inactive-color="#F56C6C">
                  </el-switch>
              </div>
                <div style="text-align: center;margin:1.5rem 0;">
                   <el-switch 
                        v-model="imageStateSwitch" 
                        active-value="1"
                        inactive-value="0"
                        active-text="图片撑满画布"
                        inactive-text="图片以原大小显示" 
                        active-color="#13ce66" 
                        inactive-color="#F56C6C">
                  </el-switch>
              </div>
                  
              <el-button type="danger" class="submit_btn" icon="el-icon-finished" style="margin:1rem" @click="saveSetting">保存设置</el-button>
          </div>
      </el-drawer>
      <div id="iframeContainer"></div>
  </div>
</template>

<script>
import '@/assets/css/index.css'
import pdfmake from 'pdfmake'
import draggable from 'vuedraggable'

import {base64FromRaster,raw2base64,base64FileHeaderMapper,unitConverter,px2inch} from '@/utils'

export default {
  name: 'Home',
  components: {
    draggable
  },
  data: function() {
        return {
            drag: false,
            settingDrawer: false, //设置-抽屉
            dialogVisible: false, //点击放大图片显示
            dialogImageUrl: '', //显示的图片地址

            pageSizeVisibleTips:false, //显示图片大小提示
            pageSizeTipsUrl:"http://img.oct1a.cn/202110230010923.png",

            mergeSwitch: 1, //是否合并
            imageStateSwitch:1,//图片是否撑满还是原比例显示 false:原大小，true:撑满
            marginCustom: false, //是否自定义
            disabled: false,//文件列表显示
            autoDirection: 1, //是否自动更改方向 1:自动 0:手动

            customMarginvalue: 10, //自定义边距值
            pageSize: "A4", //页面大小
            direction: 'portrait', //页面方向
            pageMargin: 'normal', //页面边距模式
            fileList: [], //上传文件列表

            // 页面大小参数
            options:[{
                label:"ISO A系列"
            }],
            // 边距定义
            marginSizeOption:{"normal":0.1,"narrow":10,"wide":30,"custom":this.customMarginvalue},
            // 尺寸大小
            sizeList :[{
                    value: 'A0',
                    width:841,
                    height:1189
                },{
                    value: 'A1',
                    width:594,
                    height:841
                },{
                    value: 'A2',
                    width:420,
                    height:594
                },{
                    value: 'A3',
                    width:297,
                    height:420
                },{
                    value: 'A4',
                    width:210,
                    height:297
                },{
                    value: 'A5',
                    width:148,
                    height:210
                }]
        }
    },
    created() {
      if(window.utools){
        utools.onPluginReady(() => {
            // 初始化默认设置
            const defaultSettings = {
                'firstEnter': false,
                'page-direction': 'portrait',
                'page-size-mode': 'A4',
                'page-margin': 'normal',
                'custom-Margin-value': 10,
                'page-merge-switch': '1',
                'page-imgState-switch': '1',
                'page-auto-direction': '1'
            };

            // 检查并设置默认值
            Object.keys(defaultSettings).forEach(key => {
                const data = window.utools.db.get(key);
                if (!data) {
                    window.utools.db.put({
                        _id: key,
                        data: defaultSettings[key]
                    });
                }
            });

            // 读取所有设置
            this.direction = this.getDBdata("page-direction");
            this.pageSize = this.getDBdata("page-size-mode");
            this.pageMargin = this.getDBdata("page-margin");
            this.customMarginvalue = this.getDBdata("custom-Margin-value");
            this.mergeSwitch = this.getDBdata("page-merge-switch");
            this.imageStateSwitch = this.getDBdata('page-imgState-switch');
            this.autoDirection = this.getDBdata('page-auto-direction');

            // 检查是否是首次进入
            const firstEnter = this.getDBdata("firstEnter");
            if (!firstEnter) {
                this.settingDrawer = true;
                this.$notify.warning({ 
                    position: 'top-left',
                    title: '提示',
                    message: '首次进入请先设置后使用，否则按默认配置！'
                });
            }
        });
      }
        // utools.onPluginEnter(({ code, type, payload }) => {
        // });
        this.options[0].options = this.sizeList.slice(0,6); //A组默认设置
    },
    methods: {
        // 清空文件列表
        clearFileList(){
            this.$refs['fileInput'].value = '';
            this.fileList = []
        },
        // 更改页面方向
        changeDirection(direction) {
            this.direction = direction
        },
        // 更改页面边距
        changeMargin(pageMargin) {
            this.pageMargin = pageMargin
            if (pageMargin == 'custom') {
                this.marginCustom = true
            } else {
                this.marginCustom = false
            }
        },
        // 开始转换
        async convert2pdf() {
            if(this.fileList.length == 0){
                this.$notify.error({ position: 'top-left',title: '提示',message: '请选择文件后操作！'});
                return false
            }

            try {
                // 显示加载提示
                const loading = this.$loading({
                    lock: true,
                    text: '正在转换PDF，请稍候...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                // 读取配置信息
                let docDefinition = {
                    pageOrientation: this.getDBdata("page-direction"),
                    pageMargins: this.marginSizeOption[this.getDBdata("page-margin")] || this.getDBdata("custom-Margin-value"),
                    pageSize: this.getDBdata("page-size-mode"),
                    pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
                    }
                }

                // 如果是自动模式，根据第一张图片判断方向
                if (this.getDBdata('page-auto-direction') == 1 && this.fileList.length > 0) {
                    const firstImage = this.fileList[0];
                    const aspectRatio = firstImage.width / firstImage.height;
                    // 如果宽高比大于1，说明是横向图片
                    docDefinition.pageOrientation = aspectRatio > 1 ? 'landscape' : 'portrait';
                }

                // 生成PDF内容
                let content = await this.createPDF(docDefinition)
                
                if(this.mergeSwitch == 1){ //合并为一个PDF
                    if (!content || content.length === 0) {
                        throw new Error('没有有效的图片内容可以转换');
                    }
                    docDefinition.content = content;
                    const pdfDoc = pdfMake.createPdf(docDefinition);
                    pdfDoc.download(`图片转PDF_${new Date().getTime()}.pdf`);
                } else { //单独分开
                    for(let i = 0; i < content.length; i++){
                        if (!content[i]) {
                            console.warn(`跳过第 ${i + 1} 张图片，转换结果无效`);
                            continue;
                        }
                        // 创建新的docDefinition对象，避免引用问题
                        const singleDocDefinition = {
                            pageOrientation: this.getDBdata("page-direction"),
                            pageMargins: this.marginSizeOption[this.getDBdata("page-margin")] || this.getDBdata("custom-Margin-value"),
                            pageSize: this.getDBdata("page-size-mode"),
                            pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                                return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
                            }
                        };

                        // 如果是自动模式，每张图片单独判断方向
                        if (this.getDBdata('page-auto-direction') == 1) {
                            const currentImage = this.fileList[i];
                            const aspectRatio = currentImage.width / currentImage.height;
                            singleDocDefinition.pageOrientation = aspectRatio > 1 ? 'landscape' : 'portrait';
                        }
                        
                        singleDocDefinition.content = [content[i]];
                        const pdfDoc = pdfMake.createPdf(singleDocDefinition);
                        pdfDoc.download(`图片转PDF_${i + 1}.pdf`);
                    }
                }

                loading.close();
                this.$notify.success({
                    title: '成功',
                    message: 'PDF转换完成！',
                    position: 'top-left'
                });
            } catch (error) {
                console.error('PDF转换失败:', error);
                this.$notify.error({
                    title: '错误',
                    message: error.message || 'PDF转换失败，请重试！',
                    position: 'top-left'
                });
            }
        },
        getPdfCanvasSize(){
          let size = this.getDBdata("page-size-mode")  //获取到A0,A1等字符串
          // 对系统默认的尺寸进行获取
          let res = this.sizeList.filter(v=>v.value === size)[0]
          let data = JSON.parse(JSON.stringify(res))
          return {canvas_width:unitConverter(data.width),canvas_height:unitConverter(data.height)}
          // 对图片像素进行换算
        },
        // 生成PDF内容
        async createPDF(docDefinition) {
            try {
                // 处理所有图片
                const results = await Promise.all(this.fileList.map(async (item) => {
                    try {
                        let imageData;
                        // 如果已经有base64Raster，直接使用
                        if (item.base64Raster) {
                            imageData = item.base64Raster;
                        } else {
                            // 否则，使用原始文件对象
                            const result = await raw2base64(item);
                            imageData = result.result;
                        }

                        // 确保图片数据是字符串类型
                        if (typeof imageData !== 'string') {
                            throw new Error('图片数据格式不正确');
                        }

                        // 确保图片数据是base64格式
                        if (!imageData.includes('data:image/')) {
                            throw new Error('图片数据格式不正确');
                        }

                        return { result: imageData };
                    } catch (error) {
                        console.error('图片转换失败:', error);
                        throw new Error(`图片 ${item.name} 转换失败`);
                    }
                }));
                
                // 生成PDF内容配置
                return results.map((r, index) => {
                    if (!r || !r.result) {
                        throw new Error(`图片 ${this.fileList[index].name} 转换结果无效`);
                    }

                    const config = {
                        image: r.result
                    };

                    // 获取画布尺寸
                    const {canvas_width, canvas_height} = this.getPdfCanvasSize();
                    const margin_value = docDefinition.pageMargins * 2;

                    if(this.getDBdata('page-imgState-switch') == 1) {
                        // 图片撑满模式
                        config.width = (docDefinition.pageOrientation == 'portrait' ? canvas_width : canvas_height) - margin_value;
                    } else {
                        // 保持原比例模式
                        const img_size = px2inch(this.fileList[index].width) / 100;
                        config.width = (canvas_width * img_size) * 1.5;
                    }

                    return config;
                });
            } catch (error) {
                console.error('创建PDF内容失败:', error);
                throw error;
            }
        },
        //点击保存设置
        saveSetting() { 
            this.saveOrUpdateDb('page-direction', this.direction)
            this.saveOrUpdateDb('page-size-mode', this.pageSize)
            this.saveOrUpdateDb('page-margin', this.pageMargin)
            this.saveOrUpdateDb('custom-Margin-value', this.customMarginvalue)
            this.saveOrUpdateDb('page-merge-switch', this.mergeSwitch)
            this.saveOrUpdateDb('page-imgState-switch', this.imageStateSwitch)
            this.saveOrUpdateDb('page-auto-direction', this.autoDirection)
            this.saveOrUpdateDb('firstEnter', true)

            this.$notify.success({title: '成功',message: '保存设置成功！',position: 'top-left'});
             //关闭设置抽屉
            setTimeout(() => {this.settingDrawer = false}, 700)

        },
        // 获取本地存储值
        getDBdata(name) {
            if (window.utools) {
                const data = window.utools.db.get(name);
                if (!data) {
                    // 根据不同的key返回对应的默认值
                    switch(name) {
                        case 'page-direction':
                            return 'portrait';
                        case 'page-size-mode':
                            return 'A4';
                        case 'page-margin':
                            return 'normal';
                        case 'custom-Margin-value':
                            return 10;
                        case 'page-merge-switch':
                            return '1';
                        case 'page-imgState-switch':
                            return '1';
                        case 'page-auto-direction':
                            return '1';
                        case 'firstEnter':
                            return false;
                        default:
                            return null;
                    }
                }
                return data.data;
            } else {
                console.log("使用的不是utools");
                // 非utools环境下也返回默认值
                switch(name) {
                    case 'page-direction':
                        return 'portrait';
                    case 'page-size-mode':
                        return 'A4';
                    case 'page-margin':
                        return 'normal';
                    case 'custom-Margin-value':
                        return 10;
                    case 'page-merge-switch':
                        return '1';
                    case 'page-imgState-switch':
                        return '1';
                    case 'page-auto-direction':
                        return '1';
                    case 'firstEnter':
                        return false;
                    default:
                        return null;
                }
            }
        },
        // 移除图片
        handleRemove(file) {
            let index = this.fileList.findIndex(v => v.uid == file.uid)
            this.fileList.splice(index, 1)
        },
        // 选择图片后显示
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 上传图片回调
        async handleFileSelect(event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    let img_to_base64 = await raw2base64(file);
                    let img = new Image();
                    
                    // 等待图片加载完成
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = img_to_base64.result;
                    });
                    
                    // 设置图片尺寸
                    file.width = img.width;
                    file.height = img.height;
                    
                    // 判断文件类型并处理
                    if (!base64FileHeaderMapper(img_to_base64.result)) {
                        const rasterResult = await base64FromRaster(img_to_base64.result, 'jpeg');
                        file.base64Raster = rasterResult.result;
                    } else {
                        file.base64Raster = img_to_base64.result;
                    }
                    
                    // 添加url属性用于显示图片
                    file.url = img_to_base64.result;
                    this.fileList.push(file);
                } catch (error) {
                    console.error('图片处理失败:', error);
                    this.$notify.error({
                        title: '错误',
                        message: `图片 ${file.name} 处理失败，已跳过`,
                        position: 'top-left'
                    });
                }
            }
        },
        // 保存数据
        saveOrUpdateDb(key, data) {
            if (!data) {
                return;
            }
            try {
                let keyData = window.utools.db.get(key);
                if (!keyData) {
                    window.utools.db.put({
                        _id: key,
                        data: data
                    });
                } else {
                    window.utools.db.put({
                        _id: key,
                        data: data,
                        _rev: keyData._rev
                    });
                }
                // 保存成功后立即更新本地数据
                this[key.replace(/-/g, '')] = data;
            } catch (error) {
                console.error('保存设置失败:', error);
                this.$notify.error({
                    title: '错误',
                    message: '保存设置失败，请重试！',
                    position: 'top-left'
                });
            }
        },
        // 图片是否撑开
        handleDragChange(evt) {
            // 确保数据更新
            this.$nextTick(() => {
                this.fileList = [...this.fileList];
            });
        },
        // 触发文件输入
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        // 处理拖放
        handleDrop(event) {
            const files = event.dataTransfer.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.handleFileSelect({ target: { files: [file] } });
            }
        },
    }
}
</script>


<style lang="less" scoped>
.home {
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f5f7fa;
    width: 100%;
    overflow-x: hidden;
}

.main-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    box-sizing: border-box;
}

.upload-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    width: 100%;
    box-sizing: border-box;
}

.upload-area {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color .3s;
    margin-bottom: 20px;
    
    &:hover {
        border-color: #409EFF;
    }
    
    .upload-placeholder {
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #8c939d;
        
        i {
            font-size: 28px;
            margin-bottom: 8px;
        }
        
        p {
            margin: 0;
            font-size: 14px;
        }
    }
}

.image-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    padding: 8px;
}

.image-item {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .image-actions {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
        
        span {
            color: white;
            font-size: 20px;
            margin: 0 10px;
            cursor: pointer;
            
            &:hover {
                color: #409EFF;
            }
        }
    }
    
    &:hover .image-actions {
        opacity: 1;
    }
}

.drag-handle {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 2;
    cursor: move;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    padding: 4px;
    color: white;
    
    &:hover {
        background: rgba(0, 0, 0, 0.7);
    }
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}



.preview-dialog {
    /deep/.el-dialog {
        max-width: 90vw;
        margin: 5vh auto !important;
    }
}

.setting-drawer {
    /deep/.el-drawer__header {
        margin-bottom: 0;
        padding: 16px 20px;
        border-bottom: 1px solid #e4e7ed;
    }
}

.fixed-buttons {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;

    .el-button {
        width: 48px;
        height: 48px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        transition: all 0.3s;

        i {
            font-size: 20px;
            margin: 0;
        }

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px 0 rgba(0,0,0,0.2);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

@media screen and (max-width: 768px) {
    .home {
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
    }

    .main-container {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .fixed-buttons {
        right: 10px;
        bottom: 10px;
    }
}

@media screen and (max-width: 480px) {
    .home {
        padding: 5px;
    }
    
    .main-container {
        padding: 0 5px;
    }
    
    .image-list {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
    }
}
</style>