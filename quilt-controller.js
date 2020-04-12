$(document).ready( ()=>{

  createGrid();

  if(localStorage.quiltImg) {
    $('#quiltImg').attr('src', localStorage.quiltImg);
  } else {
    localStorage.setItem('quiltImg', "https://i.imgur.com/009x4GQ.jpg");
  }

  $(".file-upload").change(function() {
    readURL(this);
  });

  $('#quiltImg').on("load", function() {
    calcPreviewLines();
  })
})

function createGrid() {
  let cols = $("#numCols").val();
  let rows = $("#numRows").val();

  let dataWidth = 500/cols;
  let dataHeight = 500/rows;

  calcPreviewLines();

  $("#quilt-table").empty();

  for (let r = 0; r < rows; r++) {
    let row = "<tr>"
    for (let c = 0; c < cols; c++) {
      row += `<td style = "width: ${dataWidth}px; height: ${dataHeight}px"></td>`;
    }
    row += `</tr>`;

    $("#quilt-table").append(row);
  }
  $("td").each((i, t) => $(t).on('mousedown', function(e) {
    e.stopPropagation();
    reroll(i);
  }))
}

function reroll(i) {
  let cols = $("#numCols").val();
  let rows = $("#numRows").val();

  let oldValue = numbers[i];
  let row = Math.floor(oldValue / rows);
  let col = oldValue % cols;

  let tries = 0;
  while (numbers[i] == oldValue && tries < 100) {
    numbers[i] = Math.floor(Math.random()*cols + row*cols);
    console.log(numbers[i]);
    tries++;
  }

  setTiles();

  console.log(2);
}

function calcPreviewLines() {
  $(".preview-line-h").remove();
  $(".preview-line-v").remove();

  let img = $("#quiltImg")[0];
  let w = img.width;
  let h = img.height;

  let cols = $("#numCols").val();
  let rows = $("#numRows").val();

  let wSpacing = w / parseInt(cols);
  let hSpacing = h / parseInt(rows);

  for (let r = 1; r < rows; r++) {
    let row = $(document.createElement("span"));
    row.addClass("preview-line-h");
    row.css({"left": "0px", "top": `${hSpacing*r}px`});
    $("#inputPreview").append(row);
  }

  for (let c = 1; c < cols; c++) {
    let col = $(document.createElement("span"));
    col.addClass("preview-line-v");
    col.css({"top": "0px", "left": `${wSpacing*c}px`});
    $("#inputPreview").append(col);
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
    localStorage.setItem('quiltImg', e.target.result);
      $('#quiltImg').attr('src', reader.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

var numbers = [];

function randomize() {
  let cols = $("#numCols").val();
  let rows = $("#numRows").val();

  $("#numFromRows li input").each((i, l) => {
    for (let a = 0; a < l.value; a++) {
      numbers.push(Math.floor(Math.random()*cols + i*cols));
    }
  })

  while (numbers.length < cols * rows) {
    numbers.push(Math.floor(Math.random() * cols * rows));
  }

  //Shuffle numbers
  for (var i = numbers.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = numbers[i];
    numbers[i] = numbers[j];
    numbers[j] = temp;
  }

  //Set background images
  setTiles();
}

function setTiles() {
  let cols = $("#numCols").val();
  let rows = $("#numRows").val();

  let img = $("#quiltImg")[0];
  if (!img) return;

  let w = img.width;
  let h = img.height;

  if (w <= 0 || h <= 0) return;

  let wSpacing = w / parseInt(cols);
  let hSpacing = h / parseInt(rows);

  for (let i = 0; i < cols * rows; i++) {
    let n = numbers[i];

    let r = Math.floor(n / rows);
    let c = n % cols;

    let x = c * wSpacing;
    let y = r * hSpacing;

    let td = $($("td")[i]);
    td.css("background-image", `url(${localStorage.quiltImg})`);
    td.css("background-position", `${x}px ${y}px`);
  }
}
