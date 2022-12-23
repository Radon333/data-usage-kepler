import React, { useEffect, useState } from 'react';
import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';
import { useDispatch } from 'react-redux';
import helpers from './helpers';

//const DATA_URL ='https://gist.githubusercontent.com/ejdoh1/1b58de3ccfcfeed1e84c29c35867dbe9/raw/1c151de13ceecc17b73ca9fb1defffdec7f285a6/sampleTripData.json';

const sampleConfig = {
  visState: {
    layers: [
      {
        id: "m6tthg8",
        type: "point",
        config: {
          dataId: "cty0l65sa",
          label: "point",
          color: [255, 203, 153],
          highlightColor: [252, 242, 26, 255],
          columns: { lat: "latitude", lng: "longitude", altitude: '' },
          isVisible: true,
          visConfig: {
            radius: 10,
            fixedRadius: false,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            strokeColor: '',
            colorRange: {
              name: "ColorBrewer YlGnBu-6",
              type: "sequential",
              category: "ColorBrewer",
              colors: [
                "#ffffcc",
                "#c7e9b4",
                "#7fcdbb",
                "#41b6c4",
                "#2c7fb8",
                "#253494",
              ],
            },
            strokeColorRange: {
              name: "Global Warming",
              type: "sequential",
              category: "Uber",
              colors: [
                "#5A1846",
                "#900C3F",
                "#C70039",
                "#E3611C",
                "#F1920E",
                "#FFC300",
              ],
            },
            radiusRange: [0, 50],
            filled: true,
          },
          hidden: false,
          textLabel: [
            {
              field: '',
              color: [255, 255, 255],
              size: 18,
              offset: [0, 0],
              anchor: "start",
              alignment: "center",
            },
          ],
        },
        visualChannels: {
          colorField: { name: "dataUsage", type: "real" },
          colorScale: "quantile",
          strokeColorField: '',
          strokeColorScale: "quantile",
          sizeField: { name: "dataUsage", type: "real" },
          sizeScale: "sqrt",
        },
      },
    ],
    interactionConfig: {
      tooltip: {
        fieldsToShow: {
          cty0l65sa: [
            { name: "id", format: '' },
            { name: "city", format: '' },
            { name: "country", format: '' },
            { name: "region", format: '' },
            { name: "dataUsage", format: '' },
          ],
        },
        compareMode: false,
        compareType: "absolute",
        enabled: true,
      },
      brush: { size: 0.5, enabled: false },
      geocoder: { enabled: false },
      coordinate: { enabled: false },
    },
    layerBlending: "normal",
    splitMaps: [],
    animationConfig: { currentTime: '', speed: 1 },
  },
  mapState: {
    bearing: 0,
    dragRotate: false,
    latitude: 23.840233416199432,
    longitude: 54.89342647853237,
    pitch: 0,
    zoom: 2.219071906077466,
    isSplit: false,
  },
};

const testdata={
  fields: [
    {
      name: 'id',
      format: '',
      type: 'real'
    },
    {
      name: 'city',
      format: '',
      type: 'string'
    },
    {
      name: 'latitude',
      format: '',
      type: 'real'
    },
    {
      name: 'longitude',
      format:'',
      type: 'real'
    },
    {
      name: 'country',
      format: '',
      type: 'string'
    },
    {
      name: 'region',
      format: '',
      type: 'string'
    },
    {
      name: 'dataUsage',
      format: '',
      type: 'real'
    }
  ],
  rows: [
    [1,"Jakarta",-6.2146,106.8451,"Indonesia","IDN",959.2118083],[2,"Delhi",28.6667,77.2167,"India","IND",774.1145961],[3,"Manila",14.6,120.9833,"Philippines","PHL",422.06373],[4,"SÃ£o Paulo",-23.5504,-46.6339,"Brazil","BRA",196.7738247],[5,"Seoul",37.56,126.99,"South Korea","KOR",196.7837638],[6,"Mumbai",19.0758,72.8775,"India","IND",975.59655],[7,"Shanghai",31.1667,121.4667,"China","CHN",302.0169865],[8,"Mexico City",19.4333,-99.1333,"Mexico","MEX",650.1610162],[9,"Guangzhou",23.1288,113.259,"China","CHN",716.4174626],[10,"Cairo",30.0444,31.2358,"Egypt","EGY",324.1491005],[11,"Beijing",39.904,116.4075,"China","CHN",622.5653602],[12,"New York",40.6943,-73.9249,"United States","USA",428.2249648],[13,"KolkÄta",22.5727,88.3639,"India","IND",839.6556529],[14,"Moscow",55.7558,37.6178,"Russia","RUS",350.1787811],[15,"Bangkok",13.75,100.5167,"Thailand","THA",424.2782535],[16,"Dhaka",23.7289,90.3944,"Bangladesh","BGD",229.5973186],[17,"Buenos Aires",-34.5997,-58.3819,"Argentina","ARG",275.4742314],[18,"ÅŒsaka",34.752,135.4582,"Japan","JPN",968.7149114],[19,"Lagos",6.45,3.4,"Nigeria","NGA",149.6397125],[20,"Istanbul",41.01,28.9603,"Turkey","TUR",552.9788907],[21,"Karachi",24.86,67.01,"Pakistan","PAK",554.1550693],[22,"Kinshasa",-4.3317,15.3139,"Congo (Kinshasa)","COD",935.7961957],[23,"Shenzhen",22.535,114.054,"China","CHN",548.458181],[24,"Bangalore",12.9791,77.5913,"India","IND",359.5946946],[25,"Ho Chi Minh City",10.8167,106.6333,"Vietnam","VNM",321.2884439],[26,"Tehran",35.7,51.4167,"Iran","IRN",284.229651],[27,"Los Angeles",34.1139,-118.4068,"United States","USA",688.3845506],[28,"Rio de Janeiro",-22.9083,-43.1964,"Brazil","BRA",532.2082525],[29,"Chengdu",30.66,104.0633,"China","CHN",278.3127063],[30,"Baoding",38.8671,115.4845,"China","CHN",223.4984608],[31,"Chennai",13.0825,80.275,"India","IND",895.5792299],[32,"Lahore",31.5497,74.3436,"Pakistan","PAK",308.4965615],[33,"London",51.5072,-0.1275,"United Kingdom","GBR",634.5660416],[34,"Paris",48.8566,2.3522,"France","FRA",601.5034671],[35,"Tianjin",39.1467,117.2056,"China","CHN",960.923215],[36,"Linyi",35.0606,118.3425,"China","CHN",963.5742737],[37,"Shijiazhuang",38.0422,114.5086,"China","CHN",311.2891276],[38,"Zhengzhou",34.7492,113.6605,"China","CHN",619.0068487],[39,"Nanyang",32.9987,112.5292,"China","CHN",412.9437227],[40,"HyderÄbÄd",17.3617,78.4747,"India","IND",117.083204],[41,"Wuhan",30.5872,114.2881,"China","CHN",504.9040064],[42,"Handan",36.6116,114.4894,"China","CHN",858.5938293],[43,"Nagoya",35.1167,136.9333,"Japan","JPN",273.605391],[44,"Weifang",36.7167,119.1,"China","CHN",593.4265808],[45,"Lima",-12.06,-77.0375,"Peru","PER",797.1832383],[46,"Zhoukou",33.625,114.6418,"China","CHN",523.7336018],[47,"Luanda",-8.8383,13.2344,"Angola","AGO",382.0797125],[48,"Ganzhou",25.8292,114.9336,"China","CHN",655.1299138],[49,"Tongshan",34.261,117.1859,"China","CHN",211.0514174],[50,"Kuala Lumpur",3.1478,101.6953,"Malaysia","MYS",782.3265554],[51,"Chicago",41.8373,-87.6862,"United States","USA",233.4887614],[52,"Heze",35.2333,115.4333,"China","CHN",268.7963068],[53,"Chongqing",29.55,106.5069,"China","CHN",605.6568928],[54,"Hanoi",21.0245,105.8412,"Vietnam","VNM",700.4653056],[55,"Fuyang",32.8986,115.8045,"China","CHN",573.6756989],[56,"Changsha",28.1987,112.9709,"China","CHN",822.6276305],[57,"Dongguan",23.0475,113.7493,"China","CHN",755.0106313],[58,"Jining",35.4,116.5667,"China","CHN",820.013931],[59,"Jinan",36.6667,116.9833,"China","CHN",424.0074754],[60,"Pune",18.5196,73.8553,"India","IND",617.9782685],[61,"Foshan",23.0292,113.1056,"China","CHN",789.5521008],[62,"BogotÃ¡",4.6126,-74.0705,"Colombia","COL",279.7193435],[63,"Ahmedabad",23.03,72.58,"India","IND",515.2380168],[64,"Nanjing",32.05,118.7667,"China","CHN",916.8083943],[65,"Changchun",43.9,125.2,"China","CHN",359.1170634],[66,"Tangshan",39.6292,118.1742,"China","CHN",412.3484951],[67,"Cangzhou",38.3037,116.8452,"China","CHN",956.6288495],[68,"Dar es Salaam",-6.8,39.2833,"Tanzania","TZA",968.8416831],[69,"Hefei",31.8639,117.2808,"China","CHN",151.9256592],[70,"Hong Kong",22.3069,114.1831,"Hong Kong","HKG",495.6981613],[71,"Shaoyang",27.2418,111.4725,"China","CHN",641.3731803],[72,"Zhanjiang",21.1967,110.4031,"China","CHN",148.7822301],[73,"Shangqiu",34.4259,115.6467,"China","CHN",210.0812108],[74,"Nantong",31.9829,120.8873,"China","CHN",597.9546149],[75,"Yancheng",33.3936,120.1339,"China","CHN",403.0091995],[76,"Nanning",22.8192,108.315,"China","CHN",849.7466288],[77,"Hengyang",26.8968,112.5857,"China","CHN",139.8393035],[78,"Zhumadian",32.9773,114.0253,"China","CHN",222.9213365],[79,"Shenyang",41.8039,123.4258,"China","CHN",736.9556397],[80,"Xingtai",37.0659,114.4753,"China","CHN",586.8540532],[81,"Xiâ€™an",34.2667,108.9,"China","CHN",582.8947415],[82,"Santiago",-33.45,-70.6667,"Chile","CHL",228.8153831],[83,"Yantai",37.3997,121.2664,"China","CHN",699.5577688],[84,"Riyadh",24.65,46.71,"Saudi Arabia","SAU",692.7843041],[85,"Luoyang",34.6587,112.4245,"China","CHN",448.9387942],[86,"Kunming",25.0433,102.7061,"China","CHN",625.5107625],[87,"Shangrao",28.4419,117.9633,"China","CHN",411.5440742],[88,"Hangzhou",30.25,120.1675,"China","CHN",648.3773926],[89,"Bijie",27.3019,105.2863,"China","CHN",666.7959837],[90,"Quanzhou",24.9139,118.5858,"China","CHN",888.7883974],[91,"Miami",25.7839,-80.2102,"United States","USA",705.3335605],[92,"Wuxi",31.5667,120.2833,"China","CHN",139.6615507],[93,"Huanggang",30.45,114.875,"China","CHN",319.8172841],[94,"Maoming",21.6618,110.9178,"China","CHN",277.9179135],[95,"Nanchong",30.7991,106.0784,"China","CHN",408.4340924],[96,"Zunyi",27.705,106.9336,"China","CHN",590.8001539],[97,"Qujing",25.5102,103.8029,"China","CHN",424.2467346],[98,"Baghdad",33.35,44.4167,"Iraq","IRQ",906.5415914],[99,"Xinyang",32.1264,114.0672,"China","CHN",473.2374653],[100,"Jieyang",23.5533,116.3649,"China","CHN",689.0890045],[101,"Khartoum",15.6031,32.5265,"Sudan","SDN",125.1405843],[102,"Madrid",40.4167,-3.7167,"Spain","ESP",191.4500916],[103,"AllahÄbÄd",25.45,81.85,"India","IND",117.6600549],[104,"Yulin",22.6293,110.1507,"China","CHN",614.5206521],[105,"Changde",29.0397,111.6839,"China","CHN",320.4980573],[106,"Liaocheng",36.45,115.9833,"China","CHN",252.4587871],[107,"Qingdao",36.1167,120.4,"China","CHN",766.481891],[108,"Dallas",32.7936,-96.7662,"United States","USA",161.7661998],[109,"Nangandao",35.2992,113.8851,"China","CHN",925.6863922],[110,"Xiangyang",32.0654,112.1531,"China","CHN",378.8341543],[111,"Philadelphia",40.0077,-75.1339,"United States","USA",442.7966254],[112,"Giza",29.987,31.2118,"Egypt","EGY",356.2845543],[113,"Luâ€™an",31.7542,116.5078,"China","CHN",750.2650205],[114,"Zhaotong",27.3328,103.7144,"China","CHN",250.3410892],[115,"Yichun",27.8041,114.383,"China","CHN",248.8388882],[116,"Dezhou",37.4513,116.3105,"China","CHN",743.5187567],[117,"Nairobi",-1.2864,36.8172,"Kenya","KEN",790.3514657],[118,"Nanchang",28.6842,115.8872,"China","CHN",420.2411563],[119,"Taiâ€™an",36.2001,117.0809,"China","CHN",805.4499173],[120,"Dazhou",31.2152,107.4947,"China","CHN",336.6717517],[121,"Houston",29.7863,-95.3889,"United States","USA",240.5258566],[122,"Guadalajara",20.6767,-103.3475,"Mexico","MEX",660.4088486],[123,"Yongzhou",26.4515,111.5953,"China","CHN",115.6170641],[124,"Atlanta",33.7627,-84.4224,"United States","USA",248.2960293],[125,"Rangoon",16.795,96.16,"Myanmar","MMR",227.3879751],[126,"Toronto",43.7417,-79.3733,"Canada","CAN",194.8502359],[127,"Suihua",46.6384,126.9808,"China","CHN",576.3307658],[128,"Saint Petersburg",59.95,30.3167,"Russia","RUS",430.9596509],[129,"Washington",38.9047,-77.0163,"United States","USA",154.664042],[130,"Qiqihar",47.3398,123.9512,"China","CHN",241.5741046],[131,"Suzhou",33.6333,116.9683,"China","CHN",202.903879],[132,"Shantou",23.3735,116.6941,"China","CHN",105.1016486],[133,"Weinan",34.4996,109.4684,"China","CHN",755.2772889],[134,"Changzhou",31.8122,119.9692,"China","CHN",366.2844784],[135,"Singapore",1.3,103.8,"Singapore","SGP",569.7875867],[136,"Fuzhou",26.0769,119.2917,"China","CHN",801.4515912],[137,"Pudong",31.2231,121.5397,"China","CHN",865.7637171],[138,"Belo Horizonte",-19.9281,-43.9419,"Brazil","BRA",522.7071817],[139,"Zhangzhou",24.5093,117.6612,"China","CHN",760.2954492],[140,"Yuncheng",35.0304,110.998,"China","CHN",463.6388615],[141,"Suzhou",31.304,120.6164,"China","CHN",275.4050982],[142,"Xianyang",34.35,108.7167,"China","CHN",364.3892478],[143,"Guilin",25.2667,110.2833,"China","CHN",721.3279983],[144,"Taizhou",32.4831,119.9,"China","CHN",439.9778638],[145,"Abidjan",5.3364,-4.0267,"CÃ´te d'Ivoire","CIV",849.2077319],[146,"Huaihua",27.5494,109.9592,"China","CHN",663.4786723],[147,"Jiâ€™an",27.1172,114.9793,"China","CHN",995.7845658],[148,"Xiaoganzhan",30.9273,113.911,"China","CHN",660.9107593],[149,"Pingdingshan",33.735,113.2999,"China","CHN",239.005057],[150,"Jiujiang",29.7048,116.0021,"China","CHN",893.8563621],[151,"SÅ«rat",21.17,72.83,"India","IND",477.9609824],[152,"Guiyang",26.5794,106.7078,"China","CHN",435.8038495],[153,"Alexandria",31.2,29.9167,"Egypt","EGY",201.3618963],[154,"Bozhou",33.8626,115.7742,"China","CHN",604.8649061],[155,"Sydney",-33.865,151.2094,"Australia","AUS",319.7974829],[156,"Huizhou",23.1115,114.4152,"China","CHN",499.4657651],[157,"Huaiâ€™an",33.5,119.1331,"China","CHN",305.745589],[158,"Chenzhou",25.7989,113.0267,"China","CHN",553.5858768],[159,"Barcelona",41.3825,2.1769,"Spain","ESP",590.9747523],[160,"Anqing",30.5,117.0333,"China","CHN",196.1882287],[161,"Suqian",33.9331,118.2831,"China","CHN",303.1335786],[162,"Boston",42.3188,-71.0846,"United States","USA",432.1528495],[163,"Jiangmen",22.5833,113.0833,"China","CHN",782.5798757],[164,"Mianyang",31.4669,104.7385,"China","CHN",719.6081544],[165,"Harbin",45.75,126.6333,"China","CHN",185.0200481],[166,"Huanglongsi",34.7936,114.3403,"China","CHN",516.7349582],[167,"Melbourne",-37.8136,144.9631,"Australia","AUS",493.1426849],[168,"Zibo",36.7831,118.0497,"China","CHN",492.6935029],[169,"Dalian",38.9,121.6,"China","CHN",623.7784484],[170,"Hengshui",37.7348,115.686,"China","CHN",258.3092637],[171,"Yibin",28.7596,104.64,"China","CHN",868.06815],[172,"Yangzhou",32.3912,119.4363,"China","CHN",959.5791417],[173,"TimbÃ­o",2.3528,-76.6819,"Colombia","COL",126.6059624],[174,"Johannesburg",-26.2044,28.0416,"South Africa","ZAF",849.2812849],[175,"Yiyang",28.5833,112.3333,"China","CHN",186.4031024],[176,"Guigang",23.0961,109.6092,"China","CHN",926.2534297],[177,"Xinpu",34.5906,119.1801,"China","CHN",859.5865753],[178,"Meizhou",24.2998,116.1191,"China","CHN",782.9882402],[179,"Casablanca",33.5992,-7.62,"Morocco","MAR",535.5478941],[180,"Langfang",39.5196,116.7006,"China","CHN",227.9912557],[181,"Zhangjiakou",40.8108,114.8811,"China","CHN",498.1826806],[182,"Chifeng",42.2663,118.9223,"China","CHN",348.5024406],[183,"Linfen",36.0812,111.5087,"China","CHN",190.106272],[184,"Jiangguanchi",34.0244,113.8201,"China","CHN",735.4933939],[185,"Kabul",34.5328,69.1658,"Afghanistan","AFG",746.7695804],[186,"Phoenix",33.5722,-112.0891,"United States","USA",543.2014573],[187,"Luzhou",28.8918,105.4409,"China","CHN",565.0126468],[188,"Taiyuan",37.8733,112.5425,"China","CHN",470.3437391],[189,"Zhaoqing",23.05,112.4667,"China","CHN",716.7608149],[190,"Xiaoxita",30.7083,111.2803,"China","CHN",713.2439189],[191,"Xiamen",24.4797,118.0819,"China","CHN",666.3934984],[192,"Fuzhou",27.9814,116.3577,"China","CHN",836.7919789],[193,"Liuzhou",24.3264,109.4281,"China","CHN",797.3902779],[194,"Zhuzhou",27.8407,113.1469,"China","CHN",532.8418464],[195,"Amman",31.95,35.9333,"Jordan","JOR",848.0792723],[196,"Jeddah",21.5428,39.1728,"Saudi Arabia","SAU",517.8221531],[197,"Chuzhou",32.3062,118.3115,"China","CHN",667.650921],[198,"Loudi",27.7378,111.9974,"China","CHN",384.9388272],[199,"Deyang",31.1289,104.395,"China","CHN",659.2914388],[200,"Qingyuan",23.6842,113.0507,"China","CHN",589.8372232],[201,"Kano",12,8.5167,"Nigeria","NGA",877.503781],[202,"Wuhu",31.334,118.3622,"China","CHN",528.8288904],[203,"Seattle",47.6211,-122.3244,"United States","USA",337.1177368],[204,"Yokohama",35.4333,139.6333,"Japan","JPN",409.9300552],[205,"Binzhou",37.3806,118.0125,"China","CHN",778.7989135],[206,"Baojishi",34.3609,107.1751,"China","CHN",666.8112121],[207,"Zaozhuang",34.8667,117.55,"China","CHN",830.1919969],[208,"Neijiang",29.5872,105.0635,"China","CHN",420.1680535],[209,"Baicheng",23.901,106.6194,"China","CHN",126.0410585],[210,"Berlin",52.5167,13.3833,"Germany","DEU",136.3279199],[211,"Anshan",41.1066,122.9895,"China","CHN",433.4504958],[212,"Lanzhou",36.0617,103.8318,"China","CHN",883.249785],[213,"Puyang",35.7639,115.03,"China","CHN",503.5349468],[214,"San Francisco",37.7562,-122.443,"United States","USA",660.4921232],[215,"Jiaozuo",35.229,113.2304,"China","CHN",519.3287542],[216,"Hechi",24.6928,108.085,"China","CHN",165.2837104],[217,"MontrÃ©al",45.5089,-73.5617,"Canada","CAN",899.529368],[218,"Detroit",42.3834,-83.1024,"United States","USA",512.233942],[219,"Chengde",40.9739,117.9322,"China","CHN",221.4732303],[220,"Busan",35.1,129.0403,"South Korea","KOR",672.6831155],[221,"Algiers",36.7764,3.0586,"Algeria","DZA",400.9689135],[222,"Hanzhong",33.0794,107.026,"China","CHN",907.2723354],[223,"Shiyan",32.6351,110.7755,"China","CHN",992.6179665],[224,"Lucknow",26.847,80.947,"India","IND",532.983136],[225,"Siping",43.1715,124.3644,"China","CHN",348.0012549],[226,"Yulinshi",38.2655,109.7388,"China","CHN",428.8997471],[227,"Changzhi",36.1953,113.097,"China","CHN",714.5435422],[228,"Qinzhou",21.95,108.6167,"China","CHN",557.5744559],[229,"Bazhou",31.8576,106.7559,"China","CHN",642.6911466],[230,"Qincheng",34.5809,105.7311,"China","CHN",379.326787],[231,"Zhongshan",22.5333,113.35,"China","CHN",414.7169915],[232,"Suining",30.5098,105.5737,"China","CHN",906.3311662],[233,"Leshan",29.5854,103.7575,"China","CHN",548.5791391],[234,"San Diego",32.8312,-117.1225,"United States","USA",459.6171855],[235,"Faisalabad",31.418,73.079,"Pakistan","PAK",806.9162488],[236,"Guangâ€™an",30.4673,106.6336,"China","CHN",117.6779245],[237,"Tongren",27.7233,109.1885,"China","CHN",312.8546972],[238,"Bengbu",32.9354,117.3531,"China","CHN",867.8576134],[239,"Santa Cruz",-17.7892,-63.1975,"Bolivia","BOL",504.9199826],[240,"Qinhuangdao",39.9398,119.5881,"China","CHN",482.4636389],[241,"Tongliao",43.6172,122.264,"China","CHN",358.6311297],[242,"Jinzhou",41.1144,121.1292,"China","CHN",300.0053682],[243,"Zhenjiang",32.2109,119.4551,"China","CHN",391.8955439],[244,"ÃœrÃ¼mqi",43.8225,87.6125,"China","CHN",457.1400473],[245,"Heyuan",23.7503,114.6923,"China","CHN",992.228594],[246,"Jaipur",26.9167,75.8667,"India","IND",798.2742292],[247,"Xinzhou",38.4178,112.7233,"China","CHN",394.7059265],[248,"Wuzhou",23.4833,111.3167,"China","CHN",840.3376197],[249,"Addis Ababa",9.0272,38.7369,"Ethiopia","ETH",485.8777294],[250,"Chaoyang",41.5757,120.4486,"China","CHN",386.6517458],[251,"BrasÃ­lia",-15.7939,-47.8828,"Brazil","BRA",309.0323993],[252,"Mashhad",36.3069,59.6042,"Iran","IRN",972.9626323],[253,"Shaoguan",24.8011,113.5927,"China","CHN",206.4364695],[254,"Kuwait City",29.375,47.98,"Kuwait","KWT",766.1221575],[255,"Shanwei",22.7664,115.3331,"China","CHN",641.579092],[256,"Quezon City",14.6333,121.0333,"Philippines","PHL",345.9493431],[257,"Minneapolis",44.9635,-93.2678,"United States","USA",665.138729],[258,"Kyiv",50.45,30.5236,"Ukraine","UKR",764.456804],[259,"Sanaa",15.35,44.2,"Yemen","YEM",150.2309987],[260,"Meishan",30.0575,103.8381,"China","CHN",166.8956902],[261,"Guatemala City",14.6099,-90.5252,"Guatemala","GTM",968.0646173],[262,"Incheon",37.4639,126.6486,"South Korea","KOR",177.2019991],[263,"Ningde",26.6617,119.5228,"China","CHN",130.5666414],[264,"Tampa",27.9942,-82.4451,"United States","USA",678.0634063],[265,"Daqing",46.5979,125.008,"China","CHN",686.8181321],[266,"Putian",25.4394,119.0103,"China","CHN",329.6096199],[267,"Bandung",-6.95,107.5667,"Indonesia","IDN",584.9786404],[268,"Surabaya",-7.2458,112.7378,"Indonesia","IDN",597.4455133],[269,"Salvador",-12.9708,-38.5108,"Brazil","BRA",497.3095381],[270,"Denver",39.7621,-104.8759,"United States","USA",513.9438106],[271,"Rome",41.8931,12.4828,"Italy","ITA",489.1732892],[272,"La Paz",-16.4942,-68.1475,"Bolivia","BOL",101.0769948],[273,"Hohhot",40.8151,111.6629,"China","CHN",647.0143743],[274,"Xiangtan",27.8431,112.9228,"China","CHN",741.1314118],[275,"Pyongyang",39.03,125.73,"North Korea","PRK",813.4217825],[276,"Taichung",24.15,120.6667,"Taiwan","TWN",106.8184416],[277,"Weihai",37.5,122.1,"China","CHN",862.0959752],[278,"Rizhao",35.4164,119.4331,"China","CHN",197.892837],[279,"Mudanjiang",44.5861,129.5997,"China","CHN",346.3036453],[280,"Kaohsiung",22.6167,120.3,"Taiwan","TWN",813.7484108],[281,"Guayaquil",-2.19,-79.8875,"Ecuador","ECU",641.9332393],[282,"Tieling",42.2841,123.8365,"China","CHN",853.9317333],[283,"Cawnpore",26.4725,80.3311,"India","IND",951.6102202],[284,"Dingxi",35.5806,104.6263,"China","CHN",829.6396043],[285,"Taipei",25.0478,121.5319,"Taiwan","TWN",180.976816],[286,"Nanping",26.6448,118.1728,"China","CHN",836.8142901],[287,"Zigong",29.3498,104.7645,"China","CHN",482.1979518],[288,"Chaozhou",23.67,116.63,"China","CHN",862.2923683],[289,"Baotou",40.6562,109.8345,"China","CHN",877.6756496],[290,"Gulou",26.0819,119.2981,"China","CHN",141.8970081],[291,"Longyan",25.0881,117.0244,"China","CHN",230.1132084],[292,"Ankang",32.6877,109.0235,"China","CHN",955.3250553],[293,"Baoshan",25.1211,99.169,"China","CHN",472.0688675],[294,"Huludao",40.7094,120.8378,"China","CHN",919.4891708],[295,"Antananarivo",-18.9386,47.5214,"Madagascar","MDG",183.6326785],[296,"Yanjiang",30.1256,104.6397,"China","CHN",884.1056369],[297,"Chattogram",22.335,91.8325,"Bangladesh","BGD",468.1385757],[298,"Santo Domingo",18.4764,-69.8933,"Dominican Republic","DOM",181.3093404],[299,"Sanming",26.2658,117.6302,"China","CHN",912.1878609],[300,"Longba",33.535,105.349,"China","CHN",591.672619]
  ]
};

function App() {
  //const [sampleTripData, setSampleTripData] = useState();
  const dispatch = useDispatch();

  /*const fetchData = async () => {
    setSampleTripData(await helpers.httpGet(DATA_URL));
  };*/

  /*useEffect(() => {
    fetchData();
  }, []);*/


  useEffect(() => {
    testdata &&
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: 'Data Usage City',
              id: 'c',
            },
            data: testdata,
          },
          option: {
            centerMap: true,
            readOnly: true,
          },
          config: sampleConfig,
        })
      );
  }, [dispatch, testdata]);

  return (
    <KeplerGl
      id='map'
      width={window.innerWidth}
      mapboxApiAccessToken='pk.eyJ1IjoicmFkb24zMzMiLCJhIjoiY2xieXh2bWhuMGYzdTNycDgwMWh6dzIwdSJ9.GT1vPOfMHXxd7GZwkCPwhQ'
      height={window.innerHeight}
    />
  );
}

export default App;