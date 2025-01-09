const career = [
    {
        year: 2023,
        companyName: "Hospital Authority",
        jobTitle: "Executive Assistant IIIA",
        stintOfEmployment: "MAR 2018 – SEP 2023",
        lastDateOfEmployment: "2023-09-19",
        companyNature: "Outreach nursing service",
        duties: "Co-ordinate with vendors regarding to asset management, documentation for medical record",
        remarks: "as a full-time staff until February 2023; turned to be part-time since March 2023",
        logo: "ha.png"
    },
    {
        year: 2017,
        companyName: "Lei Garden Restaurant Group",
        jobTitle: "Production Planning Assistant",
        stintOfEmployment: "MAY 2017 – JUL 2017",
        lastDateOfEmployment: "2017-07-02",
        companyNature: "Food production and supply",
        duties: "Facilitate food supply from factory to restaurant",
        remarks: null,
        logo: "leiGarden.png"
    },
    {
        year: 2017,
        companyName: "Electrical and Mechanical Services Department",
        jobTitle: "Project Clerk",
        stintOfEmployment: "NOV 2014 – JAN 2017",
        lastDateOfEmployment: "2017-01-15",
        companyNature: "Electrical maintenance at airport",
        duties: "Clerical support for payment settlement",
        remarks: "hired via subcontractor, RNB Engineering Hong Kong Ltd.",
        logo: "emsd.png"
    },
    {
        year: 2014,
        companyName: "Transtech Optical Communication Co., Ltd.",
        jobTitle: "Technical Operator",
        stintOfEmployment: "JUN 2013 – JAN 2014",
        lastDateOfEmployment: "2014-01-29",
        companyNature: "Optical fiber manufacturing",
        duties: "Product’s quality assurance",
        remarks: null,
        logo: "transtech.png"
    },
    {
        year: 2012,
        companyName: "PwC HK",
        jobTitle: "Marketing Assistant",
        stintOfEmployment: "OCT 2011 – AUG 2012",
        lastDateOfEmployment: "2012-08-10",
        companyNature: "Audit service",
        duties: "Clerical support in various marketing activities",
        remarks: "hired via job hunting agency, Job-Hunter Employment Agency",
        logo: "pwc.png"
    },
    {
        year: 2011,
        companyName: "Linktech Hong Kong Limited",
        jobTitle: "Data Entry Clerk",
        stintOfEmployment: "MAY 2010 – APR 2011",
        lastDateOfEmployment: "2011-04-02",
        companyNature: "Repairing service for electronic products",
        duties: "Data entry, invoice verification",
        remarks: null,
        logo: null
    },
    {
        year: 2010,
        companyName: "Education Bureau",
        jobTitle: "Activity Assistant",
        stintOfEmployment: "DEC 2009 – FEB 2010",
        lastDateOfEmployment: "2010-02-04",
        companyNature: "Civil service",
        duties: "Clerical support, assisting in administrating gallery",
        remarks: "hired via job hunting agency, Bravo Personnel Consultancy Limited",
        logo: "eb.png"
    },
    {
        year: 2007,
        companyName: "Education Bureau",
        jobTitle: "Project Assistant",
        stintOfEmployment: "JUL 2006 – JUL 2007",
        lastDateOfEmployment: "2007-07-02",
        companyNature: "Civil service",
        duties: "Clerical support, assisting in preparing seminars",
        remarks: null,
        logo: "eb.png"
    },
    {
        year: 2006,
        companyName: "Wah Tat Packing & Stationery Co. Ltd.",
        jobTitle: "IT Clerk",
        stintOfEmployment: "OCT 2005 – MAY 2006",
        lastDateOfEmployment: "2006-05-10",
        companyNature: "Stationery wholesaling",
        duties: "Leaflet design, routine warehouse tasks",
        remarks: null,
        logo: "wahtat.gif"
    },
];


const jobRecord = document.getElementById("history");

setCareerTimeline(career);

function setCareerTimeline (arr) {

    while (jobRecord.hasChildNodes()) {
        jobRecord.removeChild(jobRecord.firstChild);
    };

    const header = document.createElement("h2");
    header.textContent = "Employment History";
    jobRecord.appendChild(header);

    arr.forEach(showCareerTimeline);
};

function showCareerTimeline (data) {

    const jobRecord = document.getElementById("history");
    const job = document.createElement("div");
    job.classList.add("cv-content");

    const jobYr = document.createElement("span");
    jobYr.textContent = data.year;
    jobYr.classList.add("year");
    job.appendChild(jobYr);

    const details = document.createElement("details");

    const summary = document.createElement("summary");
    const jobInfo = document.createElement("span");
    const boldCompany = document.createElement("b");
    const expandIcon = document.createElement("i");
    const collapseIcon = document.createElement("i");
    boldCompany.textContent = data.companyName;
    expandIcon.classList.add("bx", "bx-expand-vertical", "bx-burst-hover");
    collapseIcon.classList.add("bx", "bx-collapse-vertical", "bx-burst-hover");
    jobInfo.appendChild(boldCompany);
    jobInfo.appendChild(expandIcon);
    jobInfo.appendChild(collapseIcon);
    summary.appendChild(jobInfo);

    const title = document.createElement("p");
    title.textContent = "Title: " + data.jobTitle;
    summary.appendChild(title);

    details.appendChild(summary);

    const industryOfCompany = document.createElement("p");
    industryOfCompany.textContent = "Nature of Company: " + data.companyNature;
    const tenure = document.createElement("p");
    tenure.textContent = "Job Stint: " + data.stintOfEmployment;
    const jobDuty = document.createElement("p");
    jobDuty.textContent = "Main Duties: " + data.duties;

    details.appendChild(industryOfCompany);
    details.appendChild(tenure);
    details.appendChild(jobDuty);

    if (data.remarks != null) {
        const note = document.createElement("p")
        note.textContent = "Remarks: " + data.remarks;
        details.appendChild(note);
    };

    job.appendChild(details);

    if (data.logo != null) {
        const imgBkg = document.createElement("img");
        imgBkg.src = "images/logo/" + data.logo;
        imgBkg.classList.add("img-bkg");
        job.appendChild(imgBkg);
    };

    jobRecord.appendChild(job);
};

const btnForAscOrder = document.getElementById("btn-asc");
const btnForDescOrder = document.getElementById("btn-desc");

btnForAscOrder.addEventListener("click", function() {
    let sortedByDate = career.sort((a, b) => {
        return new Date(a.lastDateOfEmployment) - new Date(b.lastDateOfEmployment);
    });
    setCareerTimeline(sortedByDate);
    btnForDescOrder.classList.remove("btn--active");
    btnForAscOrder.classList.add("btn--active");
});

btnForDescOrder.addEventListener("click", function() {
    let sortedByDate = career.sort((a, b) => {
        return new Date(b.lastDateOfEmployment) - new Date(a.lastDateOfEmployment);
    });
    setCareerTimeline(sortedByDate);
    btnForDescOrder.classList.add("btn--active");
    btnForAscOrder.classList.remove("btn--active");
});