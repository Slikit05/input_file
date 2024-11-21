window.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");

  app.insertAdjacentHTML(
    "beforeend",
    `
      <div class=' form-input'>
        <form action=''>
          <div class='form-input__wrapper'>
            <h1 class='form-input__title'>Инпут-Файл</h1>
            <div class='form-input__info'>
              <span class='message'></span>
            </div>
            <div class='form-input__grid'></div>
            <div class='form-input__bottom'>
              <label class='form-input__field'>
                <input type='file' multiple />
                <span class='form-input__btn'>Загрузить файл</span>
              </label>
              <button class='form-input__go' type='submit'>Отправить</button>
            </div>
          </div>
        </form>
      </div>
  `
  );

  let fileList = [];
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

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (fileList[i]) {
        if (fileList.find(elem => elem.name === file.name)) {
          console.log('fire')
          return;
        }
      }

      if (fileList.length < 5) {
        const preview = document.createElement("div");
        preview.classList.add("preview");

        const previewImg = document.createElement("img");
        previewImg.classList.add("preview__img");
        preview.appendChild(previewImg);

        const previewButton = document.createElement("button");
        previewButton.classList.add("preview__delete");
        previewButton.innerText = "Удалить";
        previewButton.type = "button";
        preview.appendChild(previewButton);

        parrentFiles.insertAdjacentElement("beforeend", preview);

        // if (fileList.splice(fileList.indexOf(file), 1)) {
        //   console.log(fileList)
        // }
        if (file.type.startsWith("image/")) {
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
            // console.log(fileList.indexOf(fileItem.name))
            // console.log(fileItem.name === fileList[i].name)
            
            fileList.push(fileItem);
            return function (e) {
              aImg.src = e.target.result;
            };
          })(previewImg);

          reader.readAsDataURL(file);

          previewButton.addEventListener("click", () => {
            if (fileList.length === 5 && document.querySelector('.error')) {
              document.querySelector('.error').remove();
            }

            fileList.splice(fileList.indexOf(fileItem), 1);
            preview.remove();
            replacementInput();
            input.addEventListener("change", event => onChange(event));
            
            // console.log(fileList);
          });
        }
      } else {
        document.querySelector('.form-input__info').innerHTML = '<span class="error">«Превышено допустимое количество файлов: 5»</span>';
      }
    }
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

    // console.log(fileList);
  });
});