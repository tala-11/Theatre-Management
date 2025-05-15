  //basic interest tracker using localStorage

const userInterests = JSON.parse(localStorage.getItem('userInterests')) || {};

function trackInterest(topic) {
    if(!userInterests[topic]) {
        userInterests[topic] = 0;
    }
    userInterests[topic]++;
    localStorage.setItem('userInterests', JSON.stringify(userInterests));
    console.log("Updated interests:", userInterests);
}

function recommendBasedOnInterest() {
    let entries = Object.entries(userInterests);
    if(entries.length===0) return "No preferences detected yet.";
    
    entries.sort((a,b)=>b[1]-a[1]);
    return `Based on your interest, you might enjoy more about: ${entries[0][0]}`;
}
