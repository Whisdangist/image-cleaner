<template>
  <div id="app">
    <div class="input-box">
      <input type="file" id="image-input" @change="upload" accept="image/png,image/gif,image/jpeg">
      <img id="input-preview">
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    upload: function () {
      let imageInput = document.getElementById('image-input').files
      if (!imageInput.length) {
        alert('请选择一个文件！')
        return
      }
      let image = imageInput[0]
      let formData = new FormData()
      formData.append('dirty-image', image)
      this.preview(image)

      let xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload')
      xhr.onload = function () {
        if (this.status === 200) {
          alert('上传成功！')
        } else {
          alert('上传失败(' + String(this.status) + ')')
        }
      }
      xhr.send(formData)
    },
    preview: function (image) {
      // 有的浏览器没有FileReader 后期可以加入兼容性代码
      let reader = new FileReader()
      reader.onload = event => {
        document.getElementById('input-preview').src = event.target.result
      }
      reader.readAsDataURL(image)
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  margin-top: 120px;
}
</style>
