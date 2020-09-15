<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        ref="upLoadRef"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :data="qiniuForm"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://up.qbox.me/"
        list-type="picture-card">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      qiniuForm:{
        token:'',
        key:''
      }
    }
  },
  created(){
    
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const imgList = this.$refs.upLoadRef.uploadFiles;
      const uploadImgList = [];
      for (let i = 0; i < imgList.length; i++) {
        uploadImgList.push({
          url:localStorage.getItem('imageRoot')+ (imgList[i].response ? imgList[i].response.key : imgList[i].name)
        });
      }
      const arr = uploadImgList;
      // if (!this.checkAllSuccess()) {
      //   this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
      //   return
      // }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = localStorage.getItem('imageRoot')+response.key
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
      // this.listObj = this.$refs.upLoadRef.uploadFiles;
      // console.log(this.listObj)
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      this.qiniuForm.token = localStorage.getItem('uploadToken')

      if (file.type.indexOf("image") == "-1") {
        this.$message.error("上传图片格式错误");
        return;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return;
      }
      let names = file.name.split('.')[1];
      let keyName = file.uid + "/" + new Date().getTime() + '.' + names;
      _self.qiniuForm.key = keyName;
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = localStorage.getItem('imageRoot') + keyName
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
