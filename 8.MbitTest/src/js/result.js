const url = window.location.href;
const urlSplit = url.split("/");
const developerPk = parseInt(urlSplit[urlSplit.length-1], 10);

function getData(){
    fetch("../data/result.json")
      .then((response) => response.json())
      .then(data => {
          const developerData = data[developerPk-1];
          
          console.log(developerData);

          setElement(developerData);

        console.log(data);
      });
}

getData();

function setElement(data){
    
}