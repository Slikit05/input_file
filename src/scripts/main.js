window.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");

  app.insertAdjacentHTML(
    "beforeend",
    `
      <div class='container-input'>
        <div class='form-input'>
          <form action=''>
            <div class='form-input__container'>
              <div class='form-input__wrapper'>
                <div class='form-input__left'>
                  <h1 class='form-input__title'>Инпут-Файл</h1>
                  <span class='form-input__info-text'>Вы можете загрузить до 5 файлов JPG, JPEG, PNG, размер одного — до 10 МБ</span>
                  <div class='form-input__bottom'>
                    <label class='form-input__field'>
                      <input type='file' multiple />
                      <span class='form-input__btn button'>Загрузить файл</span>
                    </label>
                  </div>
                </div>
                <div class='form-input__right'>

                </div>
              </div>
              <div class='form-input__grid'></div>
              <div class='form-input__info'></div>
              <button class='form-input__go button' type='submit'>Отправить</button>
            </div>
          </form>
        </div>
      </div>
  `
  );

  const format = ['jpg', 'jpeg', 'png'];

  let fileList = [];
  let fileListError = [];

  const buttonSubmit = document.querySelector(".form-input__go");
  const parrentFiles = document.querySelector(".form-input__grid");
  let input = document.querySelector(".form-input__field input");

  const replacementInput = () => {
    input.value = "";
    const newInput = input.cloneNode(true);
    input.replaceWith(newInput);
    input = newInput;
  }

  const onChange = (event) => {
    const eventTar = event.target;
    const files = eventTar.files;
    const messages = [];

    if (document.querySelector('.message')) {
      document.querySelector('.message').remove();
    }

    const showMessage = (message, type) => {
      const messageParent = document.querySelector('.form-input__info');

      messageParent.innerHTML = `<div class='message'>
        <div class="message__wrap">
        </div>
        <div class='message-delete'></div>
      </div>`;

      message.forEach(elem => {
        document.querySelector('.message__wrap').insertAdjacentHTML('beforeend', `<span class="message__text ${type}">${elem}</span>`)
      })

      document.querySelector('.message-delete').addEventListener('click', event => {
        const evenTar = event.target;

        evenTar.closest('.message').remove();
      })
    }

    const showListFiles = (messageWrap, arr) => {
      messageWrap.insertAdjacentHTML('beforeend', '<span class="message__caption">Не загруженные файлы:</span><ul class="message__list"></ul>')

      arr.forEach(elem => {
        messageWrap.querySelector('.message__list').insertAdjacentHTML('beforeend', `<li class="message__item">
          <span class="">Имя файла: ${elem.name}</span>
          <ul>
            ${elem.sizeError ? `<li>${elem.sizeError}</li>` : ''}
            ${elem.formatError ? `<li>${elem.formatError}</li>` : ''}
            ${elem.addedError ? `<li>${elem.addedError}</li>` : ''}
            ${elem.moreFilesError ? `<li>${elem.moreFilesError}</li>` : ''}
          </ul>
        </li>`)
      });
    }

    const readableFileSize = (size, sizeType) => {
      const DEFAULT_SIZE = 0;
      const fileSize = size ?? DEFAULT_SIZE;
    
      if (!fileSize) {
        return `${DEFAULT_SIZE} kb`;
      }
    
      const sizeKb = fileSize / 1024;
      
      if (sizeType === 'MB') {
        return Number((sizeKb / 1024).toFixed(2));
      } else if (sizeType === "KB") {
        if (size > 1024) {
          return `${(size / 1024).toFixed(2)} MB`;
        } else {
          return `${size.toFixed(2)} KB`;
        }
      }
    }

    fileListError = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const itemError = {
        name: file.name,
        sizeError: readableFileSize(file.size, 'MB') > 10 ? 'Превышен максимальный размер файла' : '',
        moreFilesError: fileList.length >= 5 ? 'Превышен максимум файлов' : '',
        formatError: !format.find(elem => elem === file.type.split('/')[1]) ? 'Неверный формат' : '',
        addedError: fileList.find(elem => elem.name === file.name) ? 'Этот файл уже добавлен' : '',
      }

      if (fileList.find(elem => elem.name === file.name)) {
        if (messages.indexOf('Файлы уже добавлены.') < 0) messages.push('Файлы уже добавлены.');
      }  else if (!format.find(elem => elem === file.type.split('/')[1])) {
        if (messages.indexOf('Неверный формат файлов') < 0) messages.push('Неверный формат файлов');
      } else if (readableFileSize(file.size, 'MB') > 10) {
        if (messages.indexOf('Превышен максимальный размер файлов') < 0) messages.push('Превышен максимальный размер файла');
      } else if (fileList.length >= 5) {
        if (messages.indexOf('Превышено допустимое количество файлов: 5') < 0) messages.push('Превышено допустимое количество файлов: 5');
      } else if (fileList.length < 5) {
        if (file.type.startsWith("image/")) {
          const preview = document.createElement("div");
          preview.classList.add("preview");
          preview.classList.add("is-animate");

          const previewWrapper = document.createElement("div")
          previewWrapper.classList.add("preview__wrapper");

          const previewImg = document.createElement("img");
          previewImg.classList.add("preview__img");
          previewWrapper.appendChild(previewImg);

          const previewButton = document.createElement("button");
          previewButton.classList.add("preview__delete");
          previewButton.classList.add("button");
          previewButton.innerText = "Удалить";
          previewButton.type = "button";
          previewWrapper.appendChild(previewButton);
          
          preview.appendChild(previewWrapper);

          parrentFiles.insertAdjacentElement("beforeend", preview);

          // console.log(file.type)

          preview.querySelector('.preview__img').insertAdjacentHTML('afterend', `
            <video class='preloader' muted autoplay loop>
              <source src="src/video/car.mp4" type="video/mp4">
            </video>
            <div class="preview__wrap-text">
              <span class='preview__name'>Имя файла: ${file.name.split('.')[0]}</span>
              <span class='preview__format'>Формат:<br> .${file.name.split('.')[1]}</span>
              <span class='preview__size'>Размер:<br> ${readableFileSize(file.size, 'KB')}</span>
            </div>
          `)

          // setTimeout(() => {
          //   document.querySelectorAll('.preview').forEach(el => {
          //     const heightPreviewImg = el.querySelector('.preview__wrapper');
          //     const preloader = el.querySelector('.preloader');
      
          //     preloader.remove();
          //     heightPreviewWrapper.style.maxHeight = `${heightPreviewWrapper.scrollHeight}px`
          //   })
          // }, 2000)


          previewImg.file = file;
          let fileItem;

          const reader = new FileReader();
          reader.onload = (function (aImg) {
            fileItem = {
              name: file.name,
              modified: file.lastModified,
              size: file.size,
              data: reader.result,
            };

            fileList.push(fileItem);
            return function (e) {
              aImg.src = e.target.result;
            };
          })(previewImg);

          reader.readAsDataURL(file);

          console.log(previewImg.scrollHeight)

          previewButton.addEventListener("click", () => {
            if (document.querySelector('.error')) {
              document.querySelector('.message').remove();
            }

            fileList.splice(fileList.indexOf(fileItem), 1);
            preview.remove();
            replacementInput();
            input.addEventListener("change", event => onChange(event));

            console.log(fileList)
          });
        }
      }

      // console.log(readableFileSize(file.size))

      if (itemError.sizeError || itemError.formatError || itemError.addedError || itemError.moreFilesError) fileListError.push(itemError);
    }

    if (messages.length) {
      showMessage(messages, 'error');
      showListFiles(document.querySelector('.message__wrap'), fileListError)
    }

    input.value = "";
    console.log(fileList)
  };

  input.addEventListener("change", event => onChange(event));

  buttonSubmit.addEventListener("click", (event) => {
    event.preventDefault();

    if (!fileList.length) {
      alert("Отправлять нечего");
      return;
    }

    alert(
      JSON.stringify(
        fileList.map(({ name, modified, size }) => ({
          name,
          modified,
          size,
          data: '',
        })),
        null,
        2
      )
    );

    replacementInput();
    input.addEventListener("change", event => onChange(event));
    parrentFiles.innerHTML = '';
    fileList = [];
  });
});