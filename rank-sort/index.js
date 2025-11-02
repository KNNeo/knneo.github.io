//--DEFAULT SETTINGS--//
const config = {
    title: "Rank Your Favourite Voice Actresses",
    delay: 200,
    show: {
        test: false,
        battle: false,
        percent: true,
        progress: true
    },
    progress: {
        decimal: 2,
    },
    history: {
        id: "rank-sort-history"
    },
    members: [
        "Hanazawa Kana",
        "Hikasa Youko",
        "Horie Yui",
        "Kayano Ai",
        "Komatsu Mikako",
        "Kotobuki Minako",
        "Ookubo Rumi",
        "Satou Satomi",
        "Taketatsu Ayana",
        "Tomatsu Haruka",
        "Toyosaki Aki",
        "Yuuki Aoi",
        "Amamiya Sora",
        "Asakura Momo",
        "Hidaka Rina",
        "Kouno Marika",
        "Minase Inori",
        "Natsukawa Shiina",
        "Numakura Manami",
        "Tachibana Rika",
        "Takahashi Rie",
        "Touyama Nao",
        "Uesaka Sumire",
        "Anzai Chika",
        "Fuchigami Mai",
        "Hondo Kaede",
        "Isobe Karin",
        "Kido Ibuki",
        "Kitou Akari",
        "Koga Aoi",
        "Kohara Konomi",
        "Lynn",
        "Nagae Rika",
        "Nagatsuma Juuri",
        "Omigawa Chiaki",
        "Oonishi Saori",
        "Oozora Naomi",
        "Toyota Moe",
        "Waki Azumi",
        "Yoshimura Haruka",
        "Aizawa Saya",
        "Ishihara Kaori",
        "Kanno Mai",
        "Naganawa Maria",
        "Ogura Yui",
        "Sakura Ayane",
        "Sasaki Nao",
        "Takao Kanon",
        "Tomita Miyu",
        "Tsuda Minami",
        "Ueda Reina",
        "Yamane Aya",
        "Yukimura Eri",
        "Suganuma Chisa",
        "Nakashima Yuki",
        "Youmiya Hina"
    ]
};

//--DOM NODE REFERENCES--//
let elemOptionLeft = document.querySelector(".options .left");
let elemOptionTie = document.querySelector(".options .tie");
let elemOptionRight = document.querySelector(".options .right");
let elemNumber = document.querySelector(".battle");
let elemPercent = document.querySelector(".percent");
let elemProgress = document.querySelector(".progress");
let elemResult = document.querySelector(".result");

//--DOM FUNCTIONS--//
function onKeyDown() {
    event.preventDefault();
    switch (event.key) {
        case "ArrowLeft":
            elemOptionLeft.click();
            break;
        case "ArrowUp":
        case "ArrowDown":
            elemOptionTie.click();
            break;
        case "ArrowRight":
            elemOptionRight.click();
            break;
        default:
            break;
    }
}

function onOptionLeft() {
    elemOptionLeft.classList.add('selected');
    setTimeout(function () {
        if (finishFlag == 0) sortList(-1);
        elemOptionLeft.classList.remove('selected');
    }, config.delay);
}

function onOptionTie() {
    elemOptionTie.classList.add('selected');
    setTimeout(function () {
        if (finishFlag == 0) sortList(1);
        elemOptionTie.classList.remove('selected');
    }, config.delay);
}

function onOptionRight() {
    elemOptionRight.classList.add('selected');
    setTimeout(function () {
        if (finishFlag == 0) sortList(0);
        elemOptionRight.classList.remove('selected');
    }, config.delay);
}

//--FUNCTIONS--//
let lstMember = new Array();
let parent = new Array();
let equal = new Array();
let rec = new Array();
let cmp1, cmp2;
let head1, head2;
let nrec;

let numQuestion;
let totalSize;
let finishSize;
let finishFlag;

function initList() {
    let n = 0;
    let mid;
    let i;

    lstMember[n] = new Array();
    for (i = 0; i < config.members.length; i++) {
        lstMember[n][i] = i;
    }
    parent[n] = -1;
    totalSize = 0;
    n++;

    for (i = 0; i < lstMember.length; i++) {
        if (lstMember[i].length >= 2) {
            mid = Math.ceil(lstMember[i].length / 2);
            lstMember[n] = new Array();
            lstMember[n] = lstMember[i].slice(0, mid);
            totalSize += lstMember[n].length;
            parent[n] = i;
            n++;
            lstMember[n] = new Array();
            lstMember[n] = lstMember[i].slice(mid, lstMember[i].length);
            totalSize += lstMember[n].length;
            parent[n] = i;
            n++;
        }
    }

    for (i = 0; i < config.members.length; i++) {
        rec[i] = 0;
    }
    nrec = 0;

    for (i = 0; i <= config.members.length; i++) {
        equal[i] = -1;
    }

    cmp1 = lstMember.length - 2;
    cmp2 = lstMember.length - 1;
    head1 = 0;
    head2 = 0;
    numQuestion = 1;
    finishSize = 0;
    finishFlag = 0;
}

function sortList(flag) {
    let i;
    let str;

    if (flag < 0) {
        rec[nrec] = lstMember[cmp1][head1];
        head1++;
        nrec++;
        finishSize++;
        while (equal[rec[nrec - 1]] != -1) {
            rec[nrec] = lstMember[cmp1][head1];
            head1++;
            nrec++;
            finishSize++;
        }
    }
    else if (flag > 0) {
        rec[nrec] = lstMember[cmp2][head2];
        head2++;
        nrec++;
        finishSize++;
        while (equal[rec[nrec - 1]] != -1) {
            rec[nrec] = lstMember[cmp2][head2];
            head2++;
            nrec++;
            finishSize++;
        }
    }
    else {
        rec[nrec] = lstMember[cmp1][head1];
        head1++;
        nrec++;
        finishSize++;
        while (equal[rec[nrec - 1]] != -1) {
            rec[nrec] = lstMember[cmp1][head1];
            head1++;
            nrec++;
            finishSize++;
        }
        equal[rec[nrec - 1]] = lstMember[cmp2][head2];
        rec[nrec] = lstMember[cmp2][head2];
        head2++;
        nrec++;
        finishSize++;
        while (equal[rec[nrec - 1]] != -1) {
            rec[nrec] = lstMember[cmp2][head2];
            head2++;
            nrec++;
            finishSize++;
        }
    }

    if (head1 < lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
        while (head1 < lstMember[cmp1].length) {
            rec[nrec] = lstMember[cmp1][head1];
            head1++;
            nrec++;
            finishSize++;
        }
    }
    else if (head1 == lstMember[cmp1].length && head2 < lstMember[cmp2].length) {
        while (head2 < lstMember[cmp2].length) {
            rec[nrec] = lstMember[cmp2][head2];
            head2++;
            nrec++;
            finishSize++;
        }
    }

    if (head1 == lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
        for (i = 0; i < lstMember[cmp1].length + lstMember[cmp2].length; i++) {
            lstMember[parent[cmp1]][i] = rec[i];
        }
        lstMember.pop();
        lstMember.pop();
        cmp1 = cmp1 - 2;
        cmp2 = cmp2 - 2;
        head1 = 0;
        head2 = 0;

        if (head1 == 0 && head2 == 0) {
            for (i = 0; i < config.members.length; i++) {
                rec[i] = 0;
            }
            nrec = 0;
        }
    }

    if (cmp1 < 0) {
        let percent = parseFloat(finishSize * 100 / totalSize).toFixed(config.progress.decimal);
        str = (config.show.battle ? "Battle No." + (numQuestion - 1) + "<br>" : "");
        elemNumber.innerHTML = str;
        elemPercent.innerHTML = percent + "% Complete";
        elemProgress.value = percent;
        if (percent >= 100) {
            elemPercent.innerHTML = "Click here to Restart";
            elemPercent.setAttribute("onclick", "window.location.reload()");
        }

        showResult();
        finishFlag = 1;
    }
    else {
        showImage();
    }
}

function showResult() {
    let ranking = 1;
    let prev = 0;
    let sameRank = 1;
    let str = "";
    let i;

    str += "<table><tr><th>{Rank}<\/th><th>{Name}<\/th><th>{Change}<\/th><\/tr>"
        .replace("{Rank}", "Rank")
        .replace("{Name}", "Name")
        .replace("{Change}", "Change");

    compareRankings();
    for (i = 0; i < config.members.length; i++) {
        let val = config.members[lstMember[0][i]].split("|");
        let name = val[0];
        let delta = parseInt(val[1]) ? Math.abs(i - parseInt(val[1])) : "-";
        let icon = delta != "-" ? (i - parseInt(val[1]) > 0 ? "arrow_drop_up" : "arrow_drop_down") : "-";
        str += "<tr><td>" + (prev != ranking ? ranking : "") + "<\/td><td>" + name + "<\/td><td value=\"" + icon + "\">" + delta.toString() + "<\/td><\/tr>";
        prev = ranking;
        if (i < config.members.length - 1) {
            if (equal[lstMember[0][i]] == lstMember[0][i + 1]) {
                sameRank++;
            } else {
                ranking += sameRank;
                sameRank = 1;
            }
        }
    }
    str += "<\/table>";

    elemResult.innerHTML = str;
    elemResult.classList.remove('hidden');
}

function compareRankings() {
    let history = JSON.parse(localStorage.getItem(config.history.id) || '[]');
    let list = [];
    if (history.length) {
        for (let member of config.members)
            list.push(member + "|" + history.indexOf(member));
    }
    localStorage.setItem(config.history.id, JSON.stringify(config.members));
    config.members = list;
}

function showImage() {
    let percent = parseFloat(finishSize * 100 / totalSize).toFixed(config.progress.decimal);
    let str0 = (config.show.battle ? "Battle No." + numQuestion + "<br>" : "");
    let str1 = "" + toNameFace(lstMember[cmp1][head1]);
    let str2 = "" + toNameFace(lstMember[cmp2][head2]);

    elemNumber.innerHTML = str0;
    elemPercent.innerHTML = percent + "% Complete";
    elemProgress.value = percent;
    elemOptionLeft.innerHTML = str1;
    elemOptionRight.innerHTML = str2;

    numQuestion++;
}

function toNameFace(n) {
    let str = config.members[n];
    return str;
}

/*
* Randomize array element order in-place.
* Using Fisher-Yates (aka Knuth) Shuffle algorithm.
*/
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//--INITIAL--//
function startup() {
    for (let key of Object.keys(config.show)) {
        if (config.show[key])
            document.querySelector('.' + key)?.classList.remove('hidden');
        else
            document.querySelector('.' + key)?.classList.add('hidden');
    }
    config.members = shuffle(config.members);
    if (config.title) {
        document.title = config.title;
        document.querySelector(".title").innerText = config.title;
    }
    if(config.description)
        document.querySelector(".description").innerText = config.description;
    initList();
    showImage();
}

function test() {
    if (!window.timer)
        window.test = 0;
    window.timer = setInterval(function () {
        if (finishFlag == 0) {
            if (window.test % 9 >= 6)
                elemOptionLeft.click();
            if (window.test % 9 >= 3)
                elemOptionTie.click();
            else
                elemOptionRight.click();
            window.test++;
        }
        else
            window.timer = null;
    }, 100);
}