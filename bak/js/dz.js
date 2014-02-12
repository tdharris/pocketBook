Dropzone.prototype.options = {
	thumbnailWidth: 100,
	thumbnailHeight: 100,
	acceptedFiles: "image/*",
	resize: function(file) {

	},
	thumbnail: function(file, dataURL) {

	}
};

Dropzone.prototype.getAcceptedFiles = function() {

};

Dropzone.prototype.init = function() {
	var noPropagation, listeners, setupHiddenFileInput;

	var noPropagation = function(e) {
		e.stopPropagation();
		if (e.preventDefault) {
		  return e.preventDefault();
		} else {
		  return e.returnValue = false;
		}
	};

	setupHiddenFileInput = function() {
      if (_this.hiddenFileInput) {
        document.body.removeChild(_this.hiddenFileInput);
      }
      _this.hiddenFileInput = document.createElement("input");
      _this.hiddenFileInput.setAttribute("type", "file");
      // _this.hiddenFileInput.setAttribute("accept", "image/*");
      _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);

      _this.hiddenFileInput.style.visibility = "hidden";
      _this.hiddenFileInput.style.position = "absolute";
      _this.hiddenFileInput.style.top = "0";
      _this.hiddenFileInput.style.left = "0";
      _this.hiddenFileInput.style.height = "0";
      _this.hiddenFileInput.style.width = "0";
      document.body.appendChild(_this.hiddenFileInput);
      return _this.hiddenFileInput.addEventListener("change", function() {
        var file, files, _i, _len;
        files = _this.hiddenFileInput.files;
        if (files.length) {
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            _this.addFile(file);
          }
        }
        return setupHiddenFileInput();
      });
    };
    setupHiddenFileInput();
};

Dropzone.prototype.createThumbnail = function(file, callback) {
  var fileReader,
    _this = this;
  fileReader = new FileReader;
  fileReader.onload = function() {
    var img;
    img = document.createElement("img");
    img.onload = function() {
      var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
      file.width = img.width;
      file.height = img.height;
      resizeInfo = _this.options.resize.call(_this, file);
      if (resizeInfo.trgWidth == null) {
        resizeInfo.trgWidth = _this.options.thumbnailWidth;
      }
      if (resizeInfo.trgHeight == null) {
        resizeInfo.trgHeight = _this.options.thumbnailHeight;
      }
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");
      canvas.width = resizeInfo.trgWidth;
      canvas.height = resizeInfo.trgHeight;
      drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
      thumbnail = canvas.toDataURL("image/png");
      _this.emit("thumbnail", file, thumbnail);
      if (callback != null) {
        return callback();
      }
    };
    return img.src = fileReader.result;
  };
  return fileReader.readAsDataURL(file);
};