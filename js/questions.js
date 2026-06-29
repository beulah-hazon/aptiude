// questions.js
// TEST_LENGTH can be changed if you want 30 or 49 etc.
const TEST_LENGTH = 30;
const TEST_TIME_MIN = 30; // minutes
const MARKS_PER_Q = 1;

const QUESTIONS = [
  { q:"If 5x + 3 = 23, find x.", options:["3","4","5","6"], answer:1,
    explain:"5x + 3 = 23 → 5x = 20 → x = 4.",
    real:"If 5 identical items + ₹3 packing cost = ₹23, each item costs ₹4."
  },
  { q:"Next number: 2,4,8,16,...", options:["18","24","32","20"], answer:2,
    explain:"Sequence doubles: 16×2 = 32.",
    real:"Doubling models growth (like simple compound growth)."
  },
  { q:"Simple interest on ₹1000 for 2 yrs at 5% p.a.?", options:["₹50","₹100","₹150","₹200"], answer:1,
    explain:"SI = P×R×T/100 = 1000×5×2/100 = 100.",
    real:"Used when calculating interest on savings."
  },
  { q:"10% discount on ₹500 final price?", options:["₹450","₹400","₹480","₹500"], answer:0,
    explain:"10% of 500 = 50 → 500 − 50 = 450.",
    real:"Shopping discounts calculation."
  },
  { q:"If a + b = 10 and a − b = 2, find a.", options:["6","4","5","8"], answer:0,
    explain:"Add: 2a = 12 → a = 6.",
    real:"Age/mix equations solved similarly."
  },
  { q:"Probability of drawing an Ace from 52 cards?", options:["1/13","1/52","4/13","1/4"], answer:0,
    explain:"4 aces / 52 cards = 1/13.",
    real:"Basic probability for game odds."
  },
  { q:"50% of 200 is?", options:["50","100","150","200"], answer:1,
    explain:"50% = 0.5 → 0.5×200 = 100.",
    real:"Halving quantities or ingredients."
  },
  { q:"CP ₹200, SP ₹250 — profit %?", options:["20%","25%","30%","15%"], answer:1,
    explain:"Profit = 50; % = (50/200)×100 = 25%.",
    real:"Retail profit margin calculation."
  },
  { q:"2^5 = ?", options:["16","32","64","8"], answer:1,
    explain:"2^5 = 32.",
    real:"Used in computing (memory sizes etc.)."
  },
  { q:"Split 40 in ratio 3:5; first part?", options:["15","25","24","30"], answer:0,
    explain:"Total parts = 8; first = (3/8)×40 = 15.",
    real:"Sharing money/resources by ratio."
  },
  { q:"Avg of 10,12,14,8,x is 11. Find x.", options:["9","10","11","12"], answer:2,
    explain:"Average×5 = 55; sum others = 44 → x = 11.",
    real:"Find missing mark from class average."
  },
  { q:"Area of rectangle L=8m W=5m?", options:["20 m²","40 m²","30 m²","45 m²"], answer:1,
    explain:"Area = L×W = 8×5 = 40 m².",
    real:"Floor area for tiling estimation."
  },
  { q:"If train covers 150 km in 3 hours, speed is?", options:["40 km/h","45 km/h","50 km/h","55 km/h"], answer:2,
    explain:"Speed = distance/time = 150/3 = 50 km/h.",
    real:"Travel time planning."
  },
  { q:"Simple ratio: 2:3 of 50 is first part?", options:["20","30","25","10"], answer:0,
    explain:"Total parts =5; first = (2/5)×50 = 20.",
    real:"Dividing resources."
  },
  { q:"If x/4 = 5, x = ?", options:["9","20","15","10"], answer:3,
    explain:"x = 5×4 = 20.",
    real:"Solving linear equations."
  },
  { q:"If CP=₹400 and loss=10%, SP = ?", options:["₹360","₹440","₹350","₹400"], answer:0,
    explain:"Loss 10% of 400 = 40 → SP = 400−40 = 360.",
    real:"Loss calculation in trading."
  },
  { q:"LCM of 6 and 8 is?", options:["12","24","48","14"], answer:1,
    explain:"Prime factors: 6=2×3, 8=2^3 → LCM=2^3×3=24.",
    real:"Useful in scheduling repeated events."
  },
  { q:"If 3 workers finish job in 10 days, 6 workers finish in?", options:["5 days","15 days","6 days","10 days"], answer:0,
    explain:"Work ∝ workers. Doubling workers halves time: 10×(3/6)=5 days.",
    real:"Workforce planning."
  },
  { q:"Convert 0.25 to fraction.", options:["1/2","1/3","1/4","1/5"], answer:2,
    explain:"0.25 = 25/100 = 1/4.",
    real:"Decimal to fraction conversion."
  },
  { q:"If 30% of x = 60, x = ?", options:["180","200","150","120"], answer:1,
    explain:"0.3x = 60 → x = 60/0.3 = 200.",
    real:"Finding original value from percent."
  },
  { q:"If a train leaves at 9:00 and arrives at 13:30, journey time?", options:["4h 30m","3h 30m","5h 30m","4h"], answer:0,
    explain:"From 9:00 to 13:30 = 4 hours 30 minutes.",
    real:"Time calculations in timetables."
  },
  { q:"If 3x = 12, x = ?", options:["3","4","2","6"], answer:1,
    explain:"x = 12/3 = 4.",
    real:"Basic algebra solving."
  },
  { q:"If a bag has 2 red and 3 blue balls, prob. of blue?", options:["2/5","3/5","1/5","1/2"], answer:1,
    explain:"3 blue out of total 5 → 3/5.",
    real:"Probability in simple experiments."
  },
  { q:"What is 15% of 200?", options:["25","30","35","40"], answer:1,
    explain:"15% of 200 = 0.15×200 = 30.",
    real:"Percentage cost calculations."
  },
  { q:"If a:b = 2:3 and sum=25, a = ?", options:["10","12","9","8"], answer:0,
    explain:"Parts=5; a = (2/5)×25 = 10.",
    real:"Partitioning totals by ratio."
  },
  { q:"If 7×8 = ?", options:["48","56","64","49"], answer:1,
    explain:"7×8 = 56.",
    real:"Multiplication basics."
  },
  { q:"If x^2 = 49, x = ?", options:["7","-7","±7","0"], answer:2,
    explain:"x = ±7 (both +7 and -7).",
    real:"Solving quadratic simple root."
  },
  { q:"If speed = 60 km/h, distance in 2.5h is?", options:["120 km","150 km","180 km","100 km"], answer:1,
    explain:"Distance = speed×time = 60×2.5 = 150 km.",
    real:"Travel distance calculation."
  },
  { q:"If 4 people can paint a wall in 6 hours, 8 people in?", options:["3h","12h","2h","4h"], answer:0,
    explain:"Double workers halves time: 6×(4/8)=3 hours.",
    real:"Resource scaling."
  },
  { q:"If a number increased by 20% becomes 240, original number?", options:["200","180","220","210"], answer:0,
    explain:"Let x be original: x×1.2=240 → x=200.",
    real:"Reverse percentage problems."
  }
];

// ensure we have at least TEST_LENGTH questions
if (QUESTIONS.length < TEST_LENGTH) {
  console.warn('Less questions than TEST_LENGTH. Set TEST_LENGTH to ' + QUESTIONS.length);
}
