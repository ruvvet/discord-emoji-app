document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});

function callAddEmoji (){
    console.log('hi')
    const response = await fetch('http://localhost:5000/browse', {
        method: 'post',
        body: JSON.stringify({ url, name }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => null);
}