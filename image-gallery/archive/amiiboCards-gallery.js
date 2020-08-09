//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[1,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAA-USZ-F0(0)001.png','portrait','Special Characters','Isabelle'],
[2,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAB-USZ-F0(0)002.png','portrait','Special Characters','Tom Nook'],
[3,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAC-USZ-F0(0)003.png','portrait','Special Characters','DJ KK'],
[4,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAD-USZ-F0(0)004.png','portrait','Special Characters','Sable'],
[5,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAE-USZ-F0(0)005.png','portrait','Special Characters','Kapp\'n'],
[6,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAF-USZ-F0(0)006.png','portrait','Special Characters','Resetti'],
[7,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAG-USZ-F0(0)007.png','portrait','Special Characters','Joan'],
[8,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAH-USZ-F0(0)008.png','portrait','Special Characters','Timmy'],
[9,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAJ-USZ-F0(0)009.png','portrait','Special Characters','Digby'],
[10,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAK-USZ-F0(0)010.png','portrait','Special Characters','Pascal'],
[11,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAL-USZ-F0(0)011.png','portrait','Special Characters','Harriet'],
[12,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAM-USZ-F0(0)012.png','portrait','Special Characters','Redd'],
[13,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAN-USZ-F0(0)013.png','portrait','Special Characters','Saharah'],
[14,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAP-USZ-F0(0)014.png','portrait','Special Characters','Luna'],
[15,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAQ-USZ-F0(0)015.png','portrait','Special Characters','Tortimer'],
[16,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAR-USZ-F0(0)016.png','portrait','Special Characters','Lyle'],
[17,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAS-USZ-F0(0)017.png','portrait','Special Characters','Lottie'],
[18,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAT-USZ-F0(0)018.png','portrait','Cat','Bob'],
[19,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAU-USZ-F0(0)019.png','portrait','Deer','Fauna'],
[20,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAV-USZ-F0(0)020.png','portrait','Bear','Curt'],
[21,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAW-USZ-F0(0)021.png','portrait','Dog','Portia'],
[22,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAX-USZ-F0(0)022.png','portrait','Tiger','Leonardo'],
[23,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAY-USZ-F0(0)023.png','portrait','Cub','Cheri'],
[24,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAZ-USZ-F0(0)024.png','portrait','Wolf','Kyle'],
[25,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABA-USZ-F0(0)025.png','portrait','Gorilla','Al'],
[26,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABB-USZ-F0(0)026.png','portrait','Rhino','Renee'],
[27,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABC-USZ-F0(0)027.png','portrait','Deer','Lopez'],
[28,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABD-USZ-F0(0)028.png','portrait','Frog','Jambette'],
[29,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABE-USZ-F0(0)029.png','portrait','Pig','Rasher'],
[30,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABF-USZ-F0(0)030.png','portrait','Rabbit','Tiffany'],
[31,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABG-USZ-F0(0)031.png','portrait','Squirrel','Sheldon'],
[32,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABH-USZ-F0(0)032.png','portrait','Cub','Bluebear'],
[33,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABJ-USZ-F0(0)033.png','portrait','Duck','Bill'],
[34,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABK-USZ-F0(0)034.png','portrait','Cat','Kiki'],
[35,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABL-USZ-F0(0)035.png','portrait','Monkey','Deli'],
[36,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABM-USZ-F0(0)036.png','portrait','Alligator','Alli'],
[37,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABN-USZ-F0(0)037.png','portrait','Cat','Kabuki'],
[38,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABP-USZ-F0(0)038.png','portrait','Cow','Patty'],
[39,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABQ-USZ-F0(0)039.png','portrait','Bird','Jitters'],
[40,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABR-USZ-F0(0)040.png','portrait','Frog','Gigi'],
[41,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABS-USZ-F0(0)041.png','portrait','Duck','Quillson'],
[42,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABT-USZ-F0(0)042.png','portrait','Kangaroo','Marcie'],
[43,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABU-USZ-F0(0)043.png','portrait','Penguin','Puck'],
[44,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABV-USZ-F0(0)044.png','portrait','Monkey','Shari'],
[45,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABW-USZ-F0(0)045.png','portrait','Octopus','Octavian'],
[46,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABX-USZ-F0(0)046.png','portrait','Horse','Winnie'],
[47,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABY-USZ-F0(0)047.png','portrait','Chicken','Knox'],
[48,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABZ-USZ-F0(0)048.png','portrait','Eagle','Sterling'],
[49,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACA-USZ-F0(0)049.png','portrait','Rabbit','Bonbon'],
[50,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACB-USZ-F0(0)050.png','portrait','Cat','Punchy'],
[51,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACC-USZ-F0(0)051.png','portrait','Elephant','Opal'],
[52,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACD-USZ-F0(0)052.png','portrait','Squirrel','Poppy'],
[53,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACE-USZ-F0(0)053.png','portrait','Mouse','Limberg'],
[54,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACF-USZ-F0(0)054.png','portrait','Duck','Deena'],
[55,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACG-USZ-F0(0)055.png','portrait','Rabbit','Snake'],
[56,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACH-USZ-F0(0)056.png','portrait','Tiger','Bangle'],
[57,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACJ-USZ-F0(0)057.png','portrait','Ostrich','Phil'],
[58,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACK-USZ-F0(0)058.png','portrait','Cat','Monique'],
[59,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACL-USZ-F0(0)059.png','portrait','Bear','Nate'],
[60,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACM-USZ-F0(0)060.png','portrait','Mouse','Samson'],
[61,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACN-USZ-F0(0)061.png','portrait','Bear','Tutu'],
[62,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACP-USZ-F0(0)062.png','portrait','Bull','TBone'],
[63,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACQ-USZ-F0(0)063.png','portrait','Squirrel','Mint'],
[64,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACR-USZ-F0(0)064.png','portrait','Cub','Pudge'],
[65,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACS-USZ-F0(0)065.png','portrait','Bird','Midge'],
[66,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACT-USZ-F0(0)066.png','portrait','Goat','Gruff'],
[67,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACU-USZ-F0(0)067.png','portrait','Hamster','Flurry'],
[68,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACV-USZ-F0(0)068.png','portrait','Horse','Clyde'],
[69,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACW-USZ-F0(0)069.png','portrait','Mouse','Bella'],
[70,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACX-USZ-F0(0)070.png','portrait','Hippo','Biff'],
[71,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACY-USZ-F0(0)071.png','portrait','Koala','Yuka'],
[72,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACZ-USZ-F0(0)072.png','portrait','Lion','Lionel'],
[73,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADA-USZ-F0(0)073.png','portrait','Penguin','Flo'],
[74,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADB-USZ-F0(0)074.png','portrait','Pig','Cobb'],
[75,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADC-USZ-F0(0)075.png','portrait','Eagle','Amelia'],
[76,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADD-USZ-F0(0)076.png','portrait','Frog','Jeremiah'],
[77,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADE-USZ-F0(0)077.png','portrait','Dog','Cherry'],
[78,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADF-USZ-F0(0)078.png','portrait','Horse','Roscoe'],
[79,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADG-USZ-F0(0)079.png','portrait','Pig','Truffles'],
[80,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADH-USZ-F0(0)080.png','portrait','Koala','Eugene'],
[81,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADJ-USZ-F0(0)081.png','portrait','Sheep','Eunice'],
[82,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADK-USZ-F0(0)082.png','portrait','Chicken','Goose'],
[83,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADL-USZ-F0(0)083.png','portrait','Anteater','Annalisa'],
[84,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADM-USZ-F0(0)084.png','portrait','Dog','Benjamin'],
[85,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADN-USZ-F0(0)085.png','portrait','Pig','Pancetti'],
[86,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADP-USZ-F0(0)086.png','portrait','Wolf','Chief'],
[87,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADQ-USZ-F0(0)087.png','portrait','Rabbit','Bunnie'],
[88,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADR-USZ-F0(0)088.png','portrait','Hamster','Clay'],
[89,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADS-USZ-F0(0)089.png','portrait','Deer','Diana'],
[90,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADT-USZ-F0(0)090.png','portrait','Elephant','Axel'],
[91,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADU-USZ-F0(0)091.png','portrait','Sheep','Muffy'],
[92,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADV-USZ-F0(0)092.png','portrait','Frog','Henry'],
[93,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADW-USZ-F0(0)093.png','portrait','Hippo','Bertha'],
[94,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADX-USZ-F0(0)094.png','portrait','Anteater','Cyrano'],
[95,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADY-USZ-F0(0)095.png','portrait','Squirrel','Peanut'],
[96,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADZ-USZ-F0(0)096.png','portrait','Rabbit','Cole'],
[97,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAEA-USZ-F0(0)097.png','portrait','Sheep','Willow'],
[98,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAEB-USZ-F0(0)098.png','portrait','Penguin','Roald'],
[99,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAEC-USZ-F0(0)099.png','portrait','Duck','Molly'],
[100,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAED-USZ-F0(0)100.png','portrait','Dog','Walker'],
[101,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEE_USZlow_101_R_ad.png','portrait','Special Characters','K.K.'],
[102,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEF_USZlow_102_R_ad.png','portrait','Special Characters','Reese'],
[103,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEG_USZlow_103_R_ad.png','portrait','Special Characters','Kicks'],
[104,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEH_USZlow_104_R_ad.png','portrait','Special Characters','Labelle'],
[105,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEJ_USZlow_105_R_ad.png','portrait','Special Characters','Copper'],
[106,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEK_USZlow_106_R_ad.png','portrait','Special Characters','Booker'],
[107,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEL_USZlow_107_R_ad.png','portrait','Special Characters','Katie'],
[108,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEM-USZ-F0(1)108_R_ad.png','portrait','Special Characters','Tommy'],
[109,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEN_USZlow_109_R_ad.png','portrait','Special Characters','Porter'],
[110,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEP_USZlow_110_R_ad.png','portrait','Special Characters','Leila'],
[111,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEQ_USZlow_111_R_ad.png','portrait','Special Characters','Shrunk'],
[112,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAER_USZlow_112_R_ad.png','portrait','Special Characters','Don'],
[113,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAES_USZlow_113_R_ad.png','portrait','Special Characters','Isabelle'],
[114,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAET_USZlow_114_R_ad.png','portrait','Special Characters','Blanca'],
[115,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEU_USZlow_115_R_ad.png','portrait','Special Characters','Nat'],
[116,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEV_USZlow_116_R_ad.png','portrait','Special Characters','Chip'],
[117,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEW_USZlow_117_R_ad.png','portrait','Special Characters','Jack'],
[118,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEX_USZlow_118_R_ad.png','portrait','Cub','Poncho'],
[119,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEY_USZlow_119_R_ad.png','portrait','Cat','Felicity'],
[120,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAEZ_USZlow_120_R_ad.png','portrait','Koala','Ozzie'],
[121,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFA_USZlow_121_R_ad.png','portrait','Elephant','Tia'],
[122,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFB_USZlow_122_R_ad.png','portrait','Bird','Lucha'],
[123,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFC_USZlow_123_R_ad.png','portrait','Deer','Fuchsia'],
[124,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFD_USZlow_124_R_ad.png','portrait','Hippo','Harry'],
[125,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFE_USZlow_125_R_ad.png','portrait','Penguin','Gwen'],
[126,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFF_USZlow_126_R_ad.png','portrait','Bull','Coach'],
[127,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFG_USZlow_127_R_ad.png','portrait','Kangaroo','Kitt'],
[128,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFH_USZlow_128_R_ad.png','portrait','Cat','Tom'],
[129,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFJ_USZlow_129_R_ad.png','portrait','Cow','Tipper'],
[130,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFK_USZlow_130_R_ad.png','portrait','Frog','Prince'],
[131,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFL_USZlow_131_R_ad.png','portrait','Duck','Pate'],
[132,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFM_USZlow_132_R_ad.png','portrait','Cub','Vladimir'],
[133,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFN_USZlow_133_R_ad.png','portrait','Horse','Savannah'],
[134,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFP-USZ-F0(1)134_R_ad.png','portrait','Goat','Kidd'],
[135,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFQ_USZlow_135_R_ad.png','portrait','Ostrich','Phoebe'],
[136,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFR_USZlow_136_R_ad.png','portrait','Chicken','Egbert'],
[137,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFS_USZlow_137_R_ad.png','portrait','Dog','Cookie'],
[138,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFT_USZlow_138_R_ad.png','portrait','Alligator','Sly'],
[139,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFU_USZlow_139_R_ad.png','portrait','Squirrel','Blaire'],
[140,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFV_USZlow_140_R_ad.png','portrait','Eagle','Avery'],
[141,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFW_USZlow_141_R_ad.png','portrait','Monkey','Nana'],
[142,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFX_USZlow_142_R_ad.png','portrait','Bird','Peck'],
[143,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFY_USZlow_143_R_ad.png','portrait','Cat','Olivia'],
[144,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAFZ_USZlow_144_R_ad.png','portrait','Gorilla','Cesar'],
[145,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGA_USZlow_145_R_ad.png','portrait','Rabbit','Carmen'],
[146,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGB_USZlow_146_R_ad.png','portrait','Hamster','Rodney'],
[147,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGC_USZlow_147_R_ad.png','portrait','Duck','Scoot'],
[148,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGD_USZlow_148_R_ad.png','portrait','Wolf','Whitney'],
[149,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGE_USZlow_149_R_ad.png','portrait','Mouse','Broccolo'],
[150,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGF_USZlow_150_R_ad.png','portrait','Rabbit','Coco'],
[151,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGG_USZlow_151_R_ad.png','portrait','Bear','Groucho'],
[152,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGH_USZlow_152_R_ad.png','portrait','Sheep','Wendy'],
[153,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGJ_USZlow_153_R_ad.png','portrait','Alligator','Alfonso'],
[154,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGK_USZlow_154_R_ad.png','portrait','Rhino','Rhonda'],
[155,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGL_USZlow_155_R_ad.png','portrait','Dog','Butch'],
[156,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGM_USZlow_156_R_ad.png','portrait','Rabbit','Gabi'],
[157,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGN_USZlow_157_R_ad.png','portrait','Mouse','Moose'],
[158,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGP_USZlow_158_R_ad.png','portrait','Sheep','Timbra'],
[159,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGQ_USZlow_159_R_ad.png','portrait','Deer','Zell'],
[160,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGR_USZlow_160_R_ad.png','portrait','Cub','Pekoe'],
[161,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGS_USZlow_161_R_ad.png','portrait','Bear','Teddy'],
[162,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGT_USZlow_162_R_ad.png','portrait','Kangaroo','Mathilda'],
[163,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGU_USZlow_163_R_ad.png','portrait','Horse','Ed'],
[164,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGV_USZlow_164_R_ad.png','portrait','Tiger','Bianca'],
[165,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGW_USZlow_165_R_ad.png','portrait','Squirrel','Filbert'],
[166,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGX_USZlow_166_R_ad.png','portrait','Cat','Kitty'],
[167,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGY_USZlow_167_R_ad.png','portrait','Deer','Beau'],
[168,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAGZ_USZlow_168_R_ad.png','portrait','Goat','Nan'],
[169,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHA_USZlow_169_R_ad.png','portrait','Lion','Bud'],
[170,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHB_USZlow_170_R_ad.png','portrait','Rabbit','Ruby'],
[171,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHC_USZlow_171_R_ad.png','portrait','Chicken','Benedict'],
[172,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHD_USZlow_172_R_ad.png','portrait','Pig','Agnes'],
[173,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHE_USZlow_173_R_ad.png','portrait','Horse','Julian'],
[174,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHF_USZlow_174_R_ad.png','portrait','Mouse','Bettina'],
[175,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHG_USZlow_175_R_ad.png','portrait','Bird','Jay'],
[176,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHH_USZlow_176_R_ad.png','portrait','Penguin','Sprinkle'],
[177,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHJ_USZlow_177_R_ad.png','portrait','Monkey','Flip'],
[178,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHK_USZlow_178_R_ad.png','portrait','Pig','Hugh'],
[179,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHL_USZlow_179_R_ad.png','portrait','Penguin','Hopper'],
[180,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHM_USZlow_180_R_ad.png','portrait','Squirrel','Pecan'],
[181,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHN_USZlow_181_R_ad.png','portrait','Duck','Drake'],
[182,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHP_USZlow_182_R_ad.png','portrait','Koala','Alice'],
[183,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHQ_USZlow_183_R_ad.png','portrait','Frog','Camofrog'],
[184,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHR_USZlow_184_R_ad.png','portrait','Mouse','Anicotti'],
[185,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHS_USZlow_185_R_ad.png','portrait','Pig','Chops'],
[186,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHT_USZlow_186_R_ad.png','portrait','Bear','Charlise'],
[187,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHU_USZlow_187_R_ad.png','portrait','Bull','Vic'],
[188,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHV_USZlow_188_R_ad.png','portrait','Cat','Ankha'],
[189,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHW_USZlow_189_R_ad.png','portrait','Frog','Drift'],
[190,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHX_USZlow_190_R_ad.png','portrait','Sheep','Vesta'],
[191,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHY_USZlow_191_R_ad.png','portrait','Dog','Marcel'],
[192,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAHZ_USZlow_192_R_ad.png','portrait','Anteater','Pango'],
[193,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJA_USZlow_193_R_ad.png','portrait','Eagle','Keaton'],
[194,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJB_USZlow_194_R_ad.png','portrait','Ostrich','Gladys'],
[195,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJC_USZlow_195_R_ad.png','portrait','Hamster','Hamphrey'],
[196,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJD_USZlow_196_R_ad.png','portrait','Wolf','Freya'],
[197,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJE_USZlow_197_R_ad.png','portrait','Cat','Kid Cat'],
[198,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJF_USZlow_198_R_ad.png','portrait','Squirrel','Agent S'],
[199,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJG_USZlow_199_R_ad.png','portrait','Elephant','Big Top'],
[200,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJH_USZlow_200_R_ad.png','portrait','Gorilla','Rocket'],
[201,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJJ_USZlow_201_R_ad.png','portrait','Special Characters','Rover'],
[202,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJK_USZlow_202_R_ad.png','portrait','Special Characters','Blathers'],
[203,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJL_USZlow_203_R_ad.png','portrait','Special Characters','Tom Nook'],
[204,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJM_USZlow_204_R_ad.png','portrait','Special Characters','Pelly'],
[205,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJN_USZlow_205_R_ad.png','portrait','Special Characters','Phyllis'],
[206,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJP_USZlow_206_R_ad.png','portrait','Special Characters','Pete'],
[207,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJQ_USZlow_207_R_ad.png','portrait','Special Characters','Mabel'],
[208,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJR_USZlow_208_R_ad.png','portrait','Special Characters','Leif'],
[209,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJS_USZlow_209_R_ad.png','portrait','Special Characters','Wendell'],
[210,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJT_USZlow_210_R_ad.png','portrait','Special Characters','Cyrus'],
[211,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJU_USZlow_211_R_ad.png','portrait','Special Characters','Grams'],
[212,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJV_USZlow_212_R_ad.png','portrait','Special Characters','Timmy'],
[213,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJW_USZlow_213_R_ad.png','portrait','Special Characters','Digby'],
[214,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJX_USZlow_214_R_ad.png','portrait','Special Characters','Don'],
[215,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJY_USZlow_215_R_ad.png','portrait','Special Characters','Isabelle'],
[216,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAJZ_USZlow_216_R_ad.png','portrait','Special Characters','Franklin'],
[217,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKA_USZlow_217_R_ad.png','portrait','Special Characters','Jingle'],
[218,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKB_USZlow_218_R_ad.png','portrait','Frog','Lily'],
[219,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKC_USZlow_219_R_ad.png','portrait','Bird','Anchovy'],
[220,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKD_USZlow_220_R_ad.png','portrait','Cat','Tabby'],
[221,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKE_USZlow_221_R_ad.png','portrait','Cub','Kody'],
[222,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKF_USZlow_222_R_ad.png','portrait','Duck','Miranda'],
[223,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKG_USZlow_223_R_ad.png','portrait','Alligator','Del'],
[224,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKH_USZlow_224_R_ad.png','portrait','Bear','Paula'],
[225,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKJ_USZlow_225_R_ad.png','portrait','Chicken','Ken'],
[226,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKK_USZlow_226_R_ad.png','portrait','Cat','Mitzi'],
[227,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKL_USZlow_227_R_ad.png','portrait','Bull','Rodeo'],
[228,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKM_USZlow_228_R_ad.png','portrait','Hippo','Bubbles'],
[229,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKN_USZlow_229_R_ad.png','portrait','Frog','Cousteau'],
[230,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKP_USZlow_230_R_ad.png','portrait','Goat','Velma'],
[231,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKQ_USZlow_231_R_ad.png','portrait','Lion','Elvis'],
[232,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKR_USZlow_232_R_ad.png','portrait','Koala','Canberra'],
[233,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKS_USZlow_233_R_ad.png','portrait','Horse','Colton'],
[234,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKT_USZlow_234_R_ad.png','portrait','Octopus','Marina'],
[235,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKU_USZlow_235_R_ad.png','portrait','Pig','Spork'],
[236,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKV_USZlow_236_R_ad.png','portrait','Duck','Freckles'],
[237,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKW_USZlow_237_R_ad.png','portrait','Deer','Bam'],
[238,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKX_USZlow_238_R_ad.png','portrait','Penguin','Friga'],
[239,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKY_USZlow_239_R_ad.png','portrait','Squirrel','Ricky'],
[240,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAKZ_USZlow_240_R_ad.png','portrait','Deer','Deirdre'],
[241,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALA_USZlow_241_R_ad.png','portrait','Gorilla','Hans'],
[242,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALB_USZlow_242_R_ad.png','portrait','Goat','Chevre'],
[243,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALC_USZlow_243_R_ad.png','portrait','Alligator','Drago'],
[244,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALD_USZlow_244_R_ad.png','portrait','Cat','Tangy'],
[245,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALE_USZlow_245_R_ad.png','portrait','Dog','Mac'],
[246,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALF_USZlow_246_R_ad.png','portrait','Elephant','Eloise'],
[247,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALG_USZlow_247_R_ad.png','portrait','Frog','Wart Jr.'],
[248,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALH_USZlow_248_R_ad.png','portrait','Squirrel','Hazel'],
[249,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALJ_USZlow_249_R_ad.png','portrait','Bear','Beardo'],
[250,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALK_USZlow_250_R_ad.png','portrait','Chicken','Ava'],
[251,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALL_USZlow_251_R_ad.png','portrait','Cub','Chester'],
[252,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALM_USZlow_252_R_ad.png','portrait','Cat','Merry'],
[253,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALN_USZlow_253_R_ad.png','portrait','Rabbit','Genji'],
[254,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALP_USZlow_254_R_ad.png','portrait','Mouse','Greta'],
[255,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALQ_USZlow_255_R_ad.png','portrait','Wolf','Wolfgang'],
[256,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALR_USZlow_256_R_ad.png','portrait','Frog','Diva'],
[257,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALS_USZlow_257_R_ad.png','portrait','Bear','Klaus'],
[258,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALT_USZlow_258_R_ad.png','portrait','Dog','Daisy'],
[259,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALU_USZlow_259_R_ad.png','portrait','Cat','Stinky'],
[260,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALV_USZlow_260_R_ad.png','portrait','Monkey','Tammi'],
[261,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALW_USZlow_261_R_ad.png','portrait','Elephant','Tucker'],
[262,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALX_USZlow_262_R_ad.png','portrait','Ostrich','Blanche'],
[263,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALY_USZlow_263_R_ad.png','portrait','Rabbit','Gaston'],
[264,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MALZ_USZlow_264_R_ad.png','portrait','Squirrel','Marshal'],
[265,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMA_USZlow_265_R_ad.png','portrait','Pig','Gala'],
[266,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMB_USZlow_266_R_ad.png','portrait','Duck','Joey'],
[267,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMC_USZlow_267_R_ad.png','portrait','Rabbit','Pippy'],
[268,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMD_USZlow_268_R_ad.png','portrait','Horse','Buck'],
[269,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAME_USZlow_269_R_ad.png','portrait','Mouse','Bree'],
[270,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMF_USZlow_270_R_ad.png','portrait','Kangaroo','Rooney'],
[271,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMG_USZlow_271_R_ad.png','portrait','Sheep','Curlos'],
[272,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMH_USZlow_272_R_ad.png','portrait','Wolf','Skye'],
[273,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMJ_USZlow_273_R_ad.png','portrait','Cat','Moe'],
[274,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMK_USZlow_274_R_ad.png','portrait','Ostrich','Flora'],
[275,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAML_USZlow_275_R_ad.png','portrait','Hamster','Hamlet'],
[276,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMM_USZlow_276_R_ad.png','portrait','Kangaroo','Astrid'],
[277,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMN_USZlow_277_R_ad.png','portrait','Monkey','Monty'],
[278,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMP_USZlow_278_R_ad.png','portrait','Mouse','Dora'],
[279,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMQ_USZlow_279_R_ad.png','portrait','Dog','Biskit'],
[280,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMR_USZlow_280_R_ad.png','portrait','Horse','Victoria'],
[281,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMS_USZlow_281_R_ad.png','portrait','Koala','Lyman'],
[282,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMT_USZlow_282_R_ad.png','portrait','Gorilla','Violet'],
[283,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMU_USZlow_283_R_ad.png','portrait','Eagle','Frank'],
[284,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMV_USZlow_284_R_ad.png','portrait','Mouse','Chadder'],
[285,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMW_USZlow_285_R_ad.png','portrait','Rhino','Merengue'],
[286,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMX_USZlow_286_R_ad.png','portrait','Penguin','Cube'],
[287,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMY_USZlow_287_R_ad.png','portrait','Tiger','Claudia'],
[288,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAMZ_USZlow_288_R_ad.png','portrait','Pig','Curly'],
[289,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANA_USZlow_289_R_ad.png','portrait','Penguin','Boomer'],
[290,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANB_USZlow_290_R_ad.png','portrait','Squirrel','Caroline'],
[291,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANC_USZlow_291_R_ad.png','portrait','Bird','Sparro'],
[292,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAND_USZlow_292_R_ad.png','portrait','Sheep','Baabara'],
[293,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANE_USZlow_293_R_ad.png','portrait','Tiger','Rolf'],
[294,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANF_USZlow_294_R_ad.png','portrait','Cub','Maple'],
[295,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANG_USZlow_295_R_ad.png','portrait','Anteater','Antonio'],
[296,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANH_USZlow_296_R_ad.png','portrait','Hamster','Soleil'],
[297,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANJ_USZlow_297_R_ad.png','portrait','Eagle','Apollo'],
[298,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANK_USZlow_298_R_ad.png','portrait','Duck','Derwin'],
[299,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANL_USZlow_299_R_ad.png','portrait','Rabbit','Francine'],
[300,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANM_USZlow_300_R_ad.png','portrait','Rabbit','Chrissy'],
[301,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANN_USZlow_301_R_ad.png','portrait','Special Characters','Isabelle'],
[302,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANP_USZlow_302_R_ad.png','portrait','Special Characters','Brewster'],
[303,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANQ_USZlow_303_R_ad.png','portrait','Special Characters','Katrina'],
[304,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANR_USZlow_304_R_ad.png','portrait','Special Characters','Phineas'],
[305,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANS_USZlow_305_R_ad.png','portrait','Special Characters','Celeste'],
[306,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANT_USZlow_306_R_ad.png','portrait','Special Characters','Tommy'],
[307,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANU_USZlow_307_R_ad.png','portrait','Special Characters','Gracie'],
[308,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANV_USZlow_308_R_ad.png','portrait','Special Characters','Leilani'],
[309,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANW_USZlow_309_R_ad.png','portrait','Special Characters','Resetti'],
[310,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANX_USZlow_310_R_ad.png','portrait','Special Characters','Timmy'],
[311,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANY_USZlow_311_R_ad.png','portrait','Special Characters','Lottie'],
[312,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MANZ_USZlow_312_R_ad.png','portrait','Special Characters','Shrunk'],
[313,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPA_USZlow_313_R_ad.png','portrait','Special Characters','PavÃ©'],
[314,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPB_USZlow_314_R_ad.png','portrait','Special Characters','Gulliver'],
[315,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPC_USZlow_315_R_ad.png','portrait','Special Characters','Redd'],
[316,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPD_USZlow_316_R_ad.png','portrait','Special Characters','Zipper'],
[317,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPE_USZlow_317_R_ad.png','portrait','Dog','Goldie'],
[318,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPF_USZlow_318_R_ad.png','portrait','Cub','Stitches'],
[319,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPG_USZlow_319_R_ad.png','portrait','Bear','Pinky'],
[320,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPH_USZlow_320_R_ad.png','portrait','Lion','Mott'],
[321,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPJ_USZlow_321_R_ad.png','portrait','Duck','Mallary'],
[322,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPK_USZlow_322_R_ad.png','portrait','Hippo','Rocco'],
[323,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPL_USZlow_323_R_ad.png','portrait','Cat','Katt'],
[324,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPM_USZlow_324_R_ad.png','portrait','Hamster','Graham'],
[325,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPN_USZlow_325_R_ad.png','portrait','Horse','Peaches'],
[326,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPP_USZlow_326_R_ad.png','portrait','Elephant','Dizzy'],
[327,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPQ_USZlow_327_R_ad.png','portrait','Mouse','Penelope'],
[328,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPR_USZlow_328_R_ad.png','portrait','Gorilla','Boone'],
[329,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPS_USZlow_329_R_ad.png','portrait','Chicken','Broffina'],
[330,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPT_USZlow_330_R_ad.png','portrait','Frog','Croque'],
[331,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPU_USZlow_331_R_ad.png','portrait','Goat','Pashmina'],
[332,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPV_USZlow_332_R_ad.png','portrait','Dog','Shep'],
[333,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPW_USZlow_333_R_ad.png','portrait','Cat','Lolly'],
[334,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPX_USZlow_334_R_ad.png','portrait','Deer','Erik'],
[335,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPY_USZlow_335_R_ad.png','portrait','Rabbit','Dotty'],
[336,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAPZ_USZlow_336_R_ad.png','portrait','Eagle','Pierce'],
[337,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQA_USZlow_337_R_ad.png','portrait','Ostrich','Queenie'],
[338,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQB_USZlow_338_R_ad.png','portrait','Wolf','Fang'],
[339,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQC_USZlow_339_R_ad.png','portrait','Sheep','Frita'],
[340,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQD_USZlow_340_R_ad.png','portrait','Penguin','Tex'],
[341,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQE_USZlow_341_R_ad.png','portrait','Koala','Melba'],
[342,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQF_USZlow_342_R_ad.png','portrait','Dog','Bones'],
[343,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQG_USZlow_343_R_ad.png','portrait','Anteater','Anabelle'],
[344,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQH_USZlow_344_R_ad.png','portrait','Cat','Rudy'],
[345,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQJ_USZlow_345_R_ad.png','portrait','Cow','Naomi'],
[346,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQK_USZlow_346_R_ad.png','portrait','Gorilla','Peewee'],
[347,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQL_USZlow_347_R_ad.png','portrait','Cub','Tammy'],
[348,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQM_USZlow_348_R_ad.png','portrait','Anteater','Olaf'],
[349,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQN_USZlow_349_R_ad.png','portrait','Pig','Lucy'],
[350,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQP_USZlow_350_R_ad.png','portrait','Horse','Elmer'],
[351,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQQ_USZlow_351_R_ad.png','portrait','Frog','Puddles'],
[352,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQR_USZlow_352_R_ad.png','portrait','Lion','Rory'],
[353,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQS_USZlow_353_R_ad.png','portrait','Monkey','Elise'],
[354,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQT_USZlow_354_R_ad.png','portrait','Kangaroo','Walt'],
[355,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQU_USZlow_355_R_ad.png','portrait','Rabbit','Mira'],
[356,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQV_USZlow_356_R_ad.png','portrait','Sheep','Pietro'],
[357,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQW_USZlow_357_R_ad.png','portrait','Penguin','Aurora'],
[358,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQX_USZlow_358_R_ad.png','portrait','Horse','Papi'],
[359,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQY_USZlow_359_R_ad.png','portrait','Hamster','Apple'],
[360,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MAQZ_USZlow_360_R_ad.png','portrait','Mouse','Rod'],
[361,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARA_USZlow_361_R_ad.png','portrait','Cat','Purrl'],
[362,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARB_USZlow_362_R_ad.png','portrait','Squirrel','Static'],
[363,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARC_USZlow_363_R_ad.png','portrait','Eagle','Celia'],
[364,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARD_USZlow_364_R_ad.png','portrait','Octopus','Zucker'],
[365,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARE_USZlow_365_R_ad.png','portrait','Pig','Peggy'],
[366,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARF_USZlow_366_R_ad.png','portrait','Frog','Ribbot'],
[367,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARG_USZlow_367_R_ad.png','portrait','Horse','Annalise'],
[368,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARH_USZlow_368_R_ad.png','portrait','Bear','Chow'],
[369,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARJ_USZlow_369_R_ad.png','portrait','Kangaroo','Sylvia'],
[370,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARK_USZlow_370_R_ad.png','portrait','Bird','Jacques'],
[371,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARL_USZlow_371_R_ad.png','portrait','Squirrel','Sally'],
[372,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARM_USZlow_372_R_ad.png','portrait','Rabbit','Doc'],
[373,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARN_USZlow_373_R_ad.png','portrait','Duck','Pompom'],
[374,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARP_USZlow_374_R_ad.png','portrait','Rhino','Tank'],
[375,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARQ_USZlow_375_R_ad.png','portrait','Chicken','Becky'],
[376,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARR_USZlow_376_R_ad.png','portrait','Mouse','Rizzo'],
[377,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARS_USZlow_377_R_ad.png','portrait','Koala','Sydney'],
[378,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MART_USZlow_378_R_ad.png','portrait','Cub','Barold'],
[379,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARU_USZlow_379_R_ad.png','portrait','Squirrel','Nibbles'],
[380,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARV_USZlow_380_R_ad.png','portrait','Pig','Kevin'],
[381,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARW_USZlow_381_R_ad.png','portrait','Duck','Gloria'],
[382,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARX_USZlow_382_R_ad.png','portrait','Wolf','Lobo'],
[383,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARY_USZlow_383_R_ad.png','portrait','Hippo','Hippeux'],
[384,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MARZ_USZlow_384_R_ad.png','portrait','Elephant','Margie'],
[385,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASA_USZlow_385_R_ad.png','portrait','Dog','Lucky'],
[386,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASB_USZlow_386_R_ad.png','portrait','Cat','Rosie'],
[387,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASC_USZlow_387_R_ad.png','portrait','Tiger','Rowan'],
[388,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASD_USZlow_388_R_ad.png','portrait','Duck','Maelle'],
[389,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASE_USZlow_389_R_ad.png','portrait','Deer','Bruce'],
[390,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASF_USZlow_390_R_ad.png','portrait','Rabbit','O\'Hare'],
[391,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASG_USZlow_391_R_ad.png','portrait','Alligator','Gayle'],
[392,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASH_USZlow_392_R_ad.png','portrait','Ostrich','Cranston'],
[393,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASJ_USZlow_393_R_ad.png','portrait','Frog','Frobert'],
[394,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASK_USZlow_394_R_ad.png','portrait','Bear','Grizzly'],
[395,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASL_USZlow_395_R_ad.png','portrait','Squirrel','Cally'],
[396,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASM_USZlow_396_R_ad.png','portrait','Monkey','Simon'],
[397,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASN_USZlow_397_R_ad.png','portrait','Penguin','Iggly'],
[398,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASP_USZlow_398_R_ad.png','portrait','Bull','Angus'],
[399,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASQ_USZlow_399_R_ad.png','portrait','Bird','Twiggy'],
[400,'https://animal-crossing.com/amiibo/assets/img/cards/NVL_C_MASR_USZlow_400_R_ad.png','portrait','Bird','Robin'],
[999,'','','','']
];


//to generate image array https://animal-crossing.com/amiibo/collections/series-1-4-amiibo-cards/
/*
for(counter = 0; counter < 25; counter++)
{
    let image = document.getElementsByClassName('ember-view amiibo-card idle')[counter].getElementsByTagName('img')[0];
    let label = document.getElementsByClassName('ember-view amiibo-card idle')[counter].getElementsByClassName('controls')[0].getElementsByTagName('h3')[0];
    console.log("[" + (counter+1) + ",'" + image.src + "','portrait','" + label.innerText + "','" + label.innerText + "'],");
}
*/

//to create dictionary: https://animalcrossing.fandom.com/wiki/Villager_list_(New_Horizons)
//exceptions: Renée(Renee), T-Bone(TBone)
/*
for(let i = 5; i < document.getElementsByTagName('tr').length; i++)
{
    console.log('' + document.getElementsByTagName('tr')[i].getElementsByTagName('td')[0].innerText.replace(' ','').replace('\'','').replace('.','') + ": \'" + document.getElementsByTagName('tr')[i].getElementsByTagName('td')[3].innerText + '\',');
}*/

let mapper = {
Admiral: 'Bird',
AgentS: 'Squirrel',
Agnes: 'Pig',
Al: 'Gorilla',
Alfonso: 'Alligator',
Alice: 'Koala',
Alli: 'Alligator',
Amelia: 'Eagle',
Anabelle: 'Anteater',
Anchovy: 'Bird',
Angus: 'Bull',
Anicotti: 'Mouse',
Ankha: 'Cat',
Annalisa: 'Anteater',
Annalise: 'Horse',
Antonio: 'Anteater',
Apollo: 'Eagle',
Apple: 'Hamster',
Astrid: 'Kangaroo',
Audie: 'Wolf',
Aurora: 'Penguin',
Ava: 'Chicken',
Avery: 'Eagle',
Axel: 'Elephant',
Baabara: 'Sheep',
Bam: 'Deer',
Bangle: 'Tiger',
Barold: 'Cub',
Bea: 'Dog',
Beardo: 'Bear',
Beau: 'Deer',
Becky: 'Chicken',
Bella: 'Mouse',
Benedict: 'Chicken',
Benjamin: 'Dog',
Bertha: 'Hippo',
Bettina: 'Mouse',
Bianca: 'Tiger',
Biff: 'Hippo',
BigTop: 'Elephant',
Bill: 'Duck',
Billy: 'Goat',
Biskit: 'Dog',
Bitty: 'Hippo',
Blaire: 'Squirrel',
Blanche: 'Ostrich',
Bluebear: 'Cub',
Bob: 'Cat',
Bonbon: 'Rabbit',
Bones: 'Dog',
Boomer: 'Penguin',
Boone: 'Gorilla',
Boots: 'Alligator',
Boris: 'Pig',
Boyd: 'Gorilla',
Bree: 'Mouse',
Broccolo: 'Mouse',
Broffina: 'Chicken',
Bruce: 'Deer',
Bubbles: 'Hippo',
Buck: 'Horse',
Bud: 'Lion',
Bunnie: 'Rabbit',
Butch: 'Dog',
Buzz: 'Eagle',
Cally: 'Squirrel',
Camofrog: 'Frog',
Canberra: 'Koala',
Candi: 'Mouse',
Carmen: 'Rabbit',
Caroline: 'Squirrel',
Carrie: 'Kangaroo',
Cashmere: 'Sheep',
Celia: 'Eagle',
Cesar: 'Gorilla',
Chadder: 'Mouse',
Charlise: 'Bear',
Cheri: 'Cub',
Cherry: 'Dog',
Chester: 'Cub',
Chevre: 'Goat',
Chief: 'Wolf',
Chops: 'Pig',
Chow: 'Bear',
Chrissy: 'Rabbit',
Claude: 'Rabbit',
Claudia: 'Tiger',
Clay: 'Hamster',
Cleo: 'Horse',
Clyde: 'Horse',
Coach: 'Bull',
Cobb: 'Pig',
Coco: 'Rabbit',
Cole: 'Rabbit',
Colton: 'Horse',
Cookie: 'Dog',
Cousteau: 'Frog',
Cranston: 'Ostrich',
Croque: 'Frog',
Cube: 'Penguin',
Curlos: 'Sheep',
Curly: 'Pig',
Curt: 'Bear',
Cyd: 'Elephant',
Cyrano: 'Anteater',
Daisy: 'Dog',
Deena: 'Duck',
Deirdre: 'Deer',
Del: 'Alligator',
Deli: 'Monkey',
Derwin: 'Duck',
Diana: 'Deer',
Diva: 'Frog',
Dizzy: 'Elephant',
Dobie: 'Wolf',
Doc: 'Rabbit',
Dom: 'Sheep',
Dora: 'Mouse',
Dotty: 'Rabbit',
Drago: 'Alligator',
Drake: 'Duck',
Drift: 'Frog',
Ed: 'Horse',
Egbert: 'Chicken',
Elise: 'Monkey',
Ellie: 'Elephant',
Elmer: 'Horse',
Eloise: 'Elephant',
Elvis: 'Lion',
Erik: 'Deer',
Eugene: 'Koala',
Eunice: 'Sheep',
Fang: 'Wolf',
Fauna: 'Deer',
Felicity: 'Cat',
Filbert: 'Squirrel',
Flip: 'Monkey',
Flo: 'Penguin',
Flora: 'Ostrich',
Flurry: 'Hamster',
Francine: 'Rabbit',
Frank: 'Eagle',
Freckles: 'Duck',
Freya: 'Wolf',
Friga: 'Penguin',
Frita: 'Sheep',
Frobert: 'Frog',
Fuchsia: 'Deer',
Gabi: 'Rabbit',
Gala: 'Pig',
Gaston: 'Rabbit',
Gayle: 'Alligator',
Genji: 'Rabbit',
Gigi: 'Frog',
Gladys: 'Ostrich',
Gloria: 'Duck',
Goldie: 'Dog',
Gonzo: 'Koala',
Goose: 'Chicken',
Graham: 'Hamster',
Greta: 'Mouse',
Grizzly: 'Bear',
Groucho: 'Bear',
Gruff: 'Goat',
Gwen: 'Penguin',
Hamlet: 'Hamster',
Hamphrey: 'Hamster',
Hans: 'Gorilla',
Harry: 'Hippo',
Hazel: 'Squirrel',
Henry: 'Frog',
Hippeux: 'Hippo',
Hopkins: 'Rabbit',
Hopper: 'Penguin',
Hornsby: 'Rhino',
Huck: 'Frog',
Hugh: 'Pig',
Iggly: 'Penguin',
Ike: 'Bear',
Jacob: 'Bird',
Jacques: 'Bird',
Jambette: 'Frog',
Jay: 'Bird',
Jeremiah: 'Frog',
Jitters: 'Bird',
Joey: 'Duck',
Judy: 'Cub',
Julia: 'Ostrich',
Julian: 'Horse',
June: 'Cub',
Kabuki: 'Cat',
Katt: 'Cat',
Keaton: 'Eagle',
Ken: 'Chicken',
Ketchup: 'Duck',
Kevin: 'Pig',
KidCat: 'Cat',
Kidd: 'Goat',
Kiki: 'Cat',
Kitt: 'Kangaroo',
Kitty: 'Cat',
Klaus: 'Bear',
Knox: 'Chicken',
Kody: 'Cub',
Kyle: 'Wolf',
Leonardo: 'Tiger',
Leopold: 'Lion',
Lily: 'Frog',
Limberg: 'Mouse',
Lionel: 'Lion',
Lobo: 'Wolf',
Lolly: 'Cat',
Lopez: 'Deer',
Louie: 'Gorilla',
Lucha: 'Bird',
Lucky: 'Dog',
Lucy: 'Pig',
Lyman: 'Koala',
Mac: 'Dog',
Maddie: 'Dog',
Maelle: 'Duck',
Maggie: 'Pig',
Mallary: 'Duck',
Maple: 'Cub',
Marcel: 'Dog',
Marcie: 'Kangaroo',
Margie: 'Elephant',
Marina: 'Octopus',
Marshal: 'Squirrel',
Mathilda: 'Kangaroo',
Megan: 'Bear',
Melba: 'Koala',
Merengue: 'Rhino',
Merry: 'Cat',
Midge: 'Bird',
Mint: 'Squirrel',
Mira: 'Rabbit',
Miranda: 'Duck',
Mitzi: 'Cat',
Moe: 'Cat',
Molly: 'Duck',
Monique: 'Cat',
Monty: 'Monkey',
Moose: 'Mouse',
Mott: 'Lion',
Muffy: 'Sheep',
Murphy: 'Cub',
Nan: 'Goat',
Nana: 'Monkey',
Naomi: 'Cow',
Nate: 'Bear',
Nibbles: 'Squirrel',
Norma: 'Cow',
Octavian: 'Octopus',
OHare: 'Rabbit',
Olaf: 'Anteater',
Olive: 'Cub',
Olivia: 'Cat',
Opal: 'Elephant',
Ozzie: 'Koala',
Pancetti: 'Pig',
Pango: 'Anteater',
Paolo: 'Elephant',
Papi: 'Horse',
Pashmina: 'Goat',
Pate: 'Duck',
Patty: 'Cow',
Paula: 'Bear',
Peaches: 'Horse',
Peanut: 'Squirrel',
Pecan: 'Squirrel',
Peck: 'Bird',
Peewee: 'Gorilla',
Peggy: 'Pig',
Pekoe: 'Cub',
Penelope: 'Mouse',
Phil: 'Ostrich',
Phoebe: 'Ostrich',
Pierce: 'Eagle',
Pietro: 'Sheep',
Pinky: 'Bear',
Piper: 'Bird',
Pippy: 'Rabbit',
Plucky: 'Chicken',
Pompom: 'Duck',
Poncho: 'Cub',
Poppy: 'Squirrel',
Portia: 'Dog',
Prince: 'Frog',
Puck: 'Penguin',
Puddles: 'Frog',
Pudge: 'Cub',
Punchy: 'Cat',
Purrl: 'Cat',
Queenie: 'Ostrich',
Quillson: 'Duck',
Raddle: 'Frog',
Rasher: 'Pig',
Raymond: 'Cat',
Renee: 'Rhino',
Reneigh: 'Horse',
Rex: 'Lion',
Rhonda: 'Rhino',
Ribbot: 'Frog',
Ricky: 'Squirrel',
Rizzo: 'Mouse',
Roald: 'Penguin',
Robin: 'Bird',
Rocco: 'Hippo',
Rocket: 'Gorilla',
Rod: 'Mouse',
Rodeo: 'Bull',
Rodney: 'Hamster',
Rolf: 'Tiger',
Rooney: 'Kangaroo',
Rory: 'Lion',
Roscoe: 'Horse',
Rosie: 'Cat',
Rowan: 'Tiger',
Ruby: 'Rabbit',
Rudy: 'Cat',
Sally: 'Squirrel',
Samson: 'Mouse',
Sandy: 'Ostrich',
Savannah: 'Horse',
Scoot: 'Duck',
Shari: 'Monkey',
Sheldon: 'Squirrel',
Shep: 'Dog',
Sherb: 'Goat',
Simon: 'Monkey',
Skye: 'Wolf',
Sly: 'Alligator',
Snake: 'Rabbit',
Snooty: 'Anteater',
Soleil: 'Hamster',
Sparro: 'Bird',
Spike: 'Rhino',
Spork: 'Pig',
Sprinkle: 'Penguin',
Sprocket: 'Ostrich',
Static: 'Squirrel',
Stella: 'Sheep',
Sterling: 'Eagle',
Stinky: 'Cat',
Stitches: 'Cub',
Stu: 'Bull',
Sydney: 'Koala',
Sylvana: 'Squirrel',
Sylvia: 'Kangaroo',
Tabby: 'Cat',
Tad: 'Frog',
Tammi: 'Monkey',
Tammy: 'Cub',
Tangy: 'Cat',
Tank: 'Rhino',
Tasha: 'Squirrel',
TBone: 'Bull',
Teddy: 'Bear',
Tex: 'Penguin',
Tia: 'Elephant',
Tiffany: 'Rabbit',
Timbra: 'Sheep',
Tipper: 'Cow',
Tom: 'Cat',
Truffles: 'Pig',
Tucker: 'Elephant',
Tutu: 'Bear',
Twiggy: 'Bird',
Tybalt: 'Tiger',
Ursala: 'Bear',
Velma: 'Goat',
Vesta: 'Sheep',
Vic: 'Bull',
Victoria: 'Horse',
Violet: 'Gorilla',
Vivian: 'Wolf',
Vladimir: 'Cub',
Wade: 'Penguin',
Walker: 'Dog',
Walt: 'Kangaroo',
WartJr: 'Frog',
Weber: 'Duck',
Wendy: 'Sheep',
Whitney: 'Wolf',
Willow: 'Sheep',
Winnie: 'Horse',
Wolfgang: 'Wolf',
Yuka: 'Koala',
Zell: 'Deer',
Zucker: 'Octopus'
};

let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
let lowestHeight = 9999;
let highestHeight = 0;
//map to imgArray firstChild
for(let label of imgArray)
{
	let labelStr = mapper[label[4].replace(' ','').replace('\'','').replace('.','')];
	if(labelStr == undefined) labelStr = 'Special Characters';
	label[3] = labelStr;
}

//generate profile category based on array
function renderGallery(array) {
	let profileCategoryHTML = document.createElement('DIV');
	profileCategoryHTML.classList.add('profile-category');
	for(let img of array)
	{
		if(img[1] == '') continue;
		let profileBoxHTML = document.createElement('DIV');
		profileBoxHTML.classList.add('profile-box');
		let profileBoxImgHTML = document.createElement('DIV');
		profileBoxImgHTML.classList.add('profile-box-img');
		let imgHTML = document.createElement('IMG');
		imgHTML.classList.add(img[2]);
		imgHTML.setAttribute('alt', img[1]);
		imgHTML.setAttribute('src', 'https://knneo.github.io/resources/spacer.gif');
		if(img[5] != 'Special Characters')
			imgHTML.title = img[5];//mapper[img[4].replace(' ','').replace('\'','').replace('.','')];
		profileBoxImgHTML.appendChild(imgHTML);
		profileBoxHTML.appendChild(profileBoxImgHTML);
		profileCategoryHTML.appendChild(profileBoxHTML);
	}
	if(document.getElementById('imgGallery').childNodes.length > 0) document.getElementById('imgGallery').innerHTML = '';
	document.getElementById('imgGallery').appendChild(profileCategoryHTML);
	
	for(var image of document.getElementsByTagName("img"))
	{
		image.src = image.alt;
		image.removeAttribute('alt');
	}

	document.getElementById('loadedCount').innerText = 0;
	lowestHeight = 9999;
	setTimeout(reloadImages,500);
	
	//add event listener when click on image
	/*for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}*/
}

function reloadImages() {
	let loadedImages = 0;
	for(var image of document.getElementsByTagName("img"))
	{
		if(image.complete)
			document.getElementById('loadedCount').innerText = ++loadedImages;
		else {
			let source = image.src;
			image.src = spacerURL;
			image.src = source;
			
		}
		
		// if(window.innerWidth >= 1040)
		// {
			// if(image.height > highestHeight && image.height > 1) //resize to highest height
				// highestHeight = image.height;
			// else
				// image.style.height = '50vh';
		// }
		// else {
			// if(image.height < lowestHeight && image.height > 1) //resize to lowest height
				// lowestHeight = image.height;
			// else
				// image.height = lowestHeight;
		// }
	}
	if(loadedImages < imgArray.length-1) setTimeout(reloadImages,500);
	if(loadedImages >= imgArray.length-1) setTimeout(function () { document.getElementById('description').style.display = 'none'; }, 2000);
}

//generate name labels
var labelArray = new Array();
for(let label of imgArray)
{
	if(label[3] == '') continue;
	let labelStr = label[3];//mapper[label[4].replace(' ','').replace('\'','').replace('.','')];
	if(labelStr == undefined) labelStr = 'Others';
	if(labelArray.indexOf(labelStr) > -1) continue;
	else labelArray.push(labelStr);
}
labelArray.sort(function (a, b) { 
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
});
//generate tickboxes
for(let label of labelArray)
{
	let labelHTML = document.createElement('LABEL');
	labelHTML.innerText = label;
	let inputHTML = document.createElement('input');
	inputHTML.type = 'checkbox';
	inputHTML.name = 'column' + label.replace(' ','');
	inputHTML.value = label;
	inputHTML.innerText = label;
	inputHTML.checked = true;
	labelHTML.insertBefore(inputHTML,labelHTML.childNodes[0]);
	document.getElementById('name').appendChild(labelHTML);
}

//add event listeners to tickboxes
document.getElementById('SelectAll').addEventListener('click', function () {
	if(document.getElementById('SelectAll').checked == true)
	{
		for (let label of document.getElementById('name').getElementsByTagName('input'))
		{
			label.checked = true;
		}
	}
	else
	{
		for (let label of document.getElementById('name').getElementsByTagName('input'))
		{
			label.checked = false;
		}
	}
	renderFilter();
});
for (let tickbox of document.getElementsByTagName('label'))
{
	tickbox.addEventListener('click', function() { renderFilter(undefined); });
	if(tickbox.innerText == 'Select All') continue;
	tickbox.addEventListener('contextmenu', function() { renderFilter(this); });
}
function renderFilter(element) {
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true)
			orientationArray.push(label.value);
	}
	
	let nameArray = new Array();
	if(element != undefined)
	{
		for (let label of document.getElementById('name').getElementsByTagName('input'))
		{
			label.checked = false;
			if(element.innerText == label.parentElement.innerText) label.checked = true;
		}
	}
	for (let label of document.getElementById('name').getElementsByTagName('input'))
	{
		if(label.checked == true)
			nameArray.push(label.value);
	}
	
	let newArray = new Array();
	for(let img of imgArray)
	{
		if(nameArray.indexOf(img[5]) > -1 && orientationArray.indexOf(img[2]) > -1)
			newArray.push(img);
	}
	renderGallery(newArray);
}

//initial viewer state
document.getElementById('viewer').addEventListener('click', function() {
	document.getElementById('viewer').style.display = 'none';
	document.getElementById('viewer').innerHTML = '';
});

//allow scroll on desktop
var scrollList = new Array();
let largestHalfWidth = 0;
let time = new Date();
document.getElementById("imgGallery").addEventListener("wheel", function(e) {
    e.preventDefault();
	document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	//console.log(new Date() - time);
	time = new Date();
	document.getElementsByClassName('profile-category')[0].scrollLeft -= e.wheelDelta;
	
	if(new Date() - time < 300 && (e.wheelDelta > 5 || e.wheelDelta < -100)) //conditions to prevent immediate snap
	{
		setTimeout( function() { 
			//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','x proximity');
			document.getElementsByClassName('profile-category')[0].classList.add('snap');
		}, 500);
		setTimeout( function() { 
			//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','none');
			document.getElementsByClassName('profile-category')[0].classList.remove('snap');
		}, 600);
	}
	
	//get relative positions of all images
	/*
	scrollList = new Array();
	for(let img of document.getElementsByClassName('profile-box'))
	{
		scrollList.push(img.getBoundingClientRect().x);
	}
	
	largestHalfWidth = document.getElementsByClassName('landscape')[0].getBoundingClientRect().width/2;
	let halfWidth = window.innerWidth/2;
	let diff = 99999; //closest x
	let imgIndex = -1; //corresponding index
	let x = 0;
	for(let i = 0; i < document.getElementsByClassName('profile-box').length; i++)
	{
		x = document.getElementsByClassName('profile-box')[i].getBoundingClientRect().x;
		if(x < halfWidth && halfWidth - x < diff)
		{
			imgIndex = i;
		}
	}
	//console.log(imgIndex);
	let imgLength = document.getElementsByClassName('profile-box').length;
	let newIndex = -1;
	if(e.wheelDelta < 0) //scroll right
		newIndex = imgIndex + 1;
	if(e.wheelDelta > 0) //scroll left
		newIndex = imgIndex - 1;
	
	let left = document.getElementsByClassName('profile-category')[0].scrollLeft;
	let newX = document.getElementsByClassName('profile-box')[newIndex].getBoundingClientRect().width;
	if(e.wheelDelta > 0) newX = -1*newX;
	//document.getElementsByClassName('profile-category')[0].scrollLeft += newX;
	let newLeft = document.getElementsByClassName('profile-category')[0].scrollLeft;
	//console.log(left + "|" + newLeft + "|" + (newX));
	*/
	
	//if(document.getElementsByClassName('profile-category')[0].scrollLeft < halfWidth)
	//	document.getElementsByClassName('profile-category')[0].scrollLeft += document.getElementsByClassName('profile-box')[2].getBoundingClientRect().x;
		
	//scroll depends on transition from image orientation eg. portrait to landscape
	//but scrollLeft value is always left edge of category box (0 is first img)
	//bountingrect.x for each image is wrt left edge of screen (0 is left edge of screen of category box)
	//document.getElementsByClassName('profile-category')[0].scrollLeft += document.getElementsByTagName('img')[1].getBoundingClientRect().x;

});

document.getElementById("imgGallery").addEventListener("touchmove", function(e) {
	document.getElementsByClassName('profile-category')[0].classList.add('snap');
});

//open image to fullscreen
let viewer = document.getElementById('viewer');
function openViewer(image) {
	//document.getElementById('ssstart').style.display = '';
	//document.getElementById('ssstop').style.display = 'none';
	//clearTimeout(runSlideshow);

	viewer.style.display = 'block';
	openImageInViewer(image);
}

function openImageInViewer(image) {
	let img = image.cloneNode(true);
	img.style.maxHeight = '100vh';
	img.style.maxWidth = '100vw';
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.appendChild(img);
	adjustViewerMargin();
}

function adjustViewerMargin() {
	//let viewer = document.getElementById('viewer');
	viewer.style.paddingTop = '0';
	viewer.style.paddingTop = (viewer.getBoundingClientRect().height - viewer.getElementsByTagName('img')[0].height)/2 + 'px';
}

//prevent right click events
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
}, false);

//"lazy load" on window load
window.onload = function () {
	renderGallery(imgArray);
}
//slideshow event
let runSlideshow;
//start slideshow
function startSlideshow() {
	document.getElementById('description').style.display = 'none';
	switchButtons();
	openFullscreen();
	randomImg();
}
//stop slideshow
function stopSlideshow() {
	closeFullscreen();
	switchButtons();
	clearTimeout(runSlideshow);
}

function switchButtons() {
	document.getElementById('ssstart').style.display = document.getElementById('ssstart').style.display == 'none' ? '' : 'none';
	document.getElementById('ssstop').style.display = document.getElementById('ssstop').style.display == 'none' ? '' : 'none';
}

function randomImg() {
	document.getElementsByClassName('profile-category')[0].classList.add('snap');
	let images = document.getElementsByClassName('profile-box');
	let selected = images[Math.floor(Math.random()*images.length)];
	selected.scrollIntoView();
	if(viewer.style.display == 'block') openImageInViewer(selected.getElementsByTagName('img')[0]);
	document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	runSlideshow = setTimeout(randomImg, 3000);
}

//allow document to fullscreen
function openFullscreen() {
if(!document.getElementById('isFullscreen').checked) return;
let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
let elem = document.documentElement;
if(document.fullscreenElement == null) return;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}