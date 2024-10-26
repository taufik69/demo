const {
  cloudinaryFileUpload,
  deleteCloudinaryFile,
} = require("../Utils/cloudinary.js");
const NewsModel = require("../Model/News.model.js");
const catagoryModel = require("../Model/catagory.model.js");
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");

const CreateNewsController = async (req, res) => {
  try {
    const { HeadLine, author, StandFirst, NewsBody, category } = req.body;
    const image = req.files?.image;
    if (!HeadLine || !author || !StandFirst || !NewsBody || !category) {
      return res
        .status(401)
        .json(new ApiError(401, null, ` News Information Missing !!`));
    }
    // check if TopNews is already exist
    const isExistNews = await NewsModel.find({ $or: [{ HeadLine }] });

    if (isExistNews?.length) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            null,
            `${HeadLine} is Alrady Exist Upload another One !!`
          )
        );
    }
    const base64 = ` <p>dgdg<img src=\"data:image/png;base64,ivborw0kggoaaaansuheugaaaqaaaaeacayaaabccqhmaaaacxbiwxmaaadhaaahyqgvw7i2aaaagxrfwhrtb2z0d2fyzqb3d3cuaw5rc2nhcguub3jnm+48ggaaiabjrefuejztnxmchmwv538vmuvo6m71ort0is5xn77hgfnagmbgbakkjceocxdg1/oygwen67gxmwh9mrgwd7uabdifwht9ru2xd4xpplyxnwiqaf0gtdr3dr15xns/wi2kpiszqyrpqvj6wwftgrxxuivjly9exnsbkbqkhukhucgucovcowggkgodfp7d/kigbewdad4mtasahabqpia7altu+adrz78jqb7aaicrpf/0axgdtk9a4gww9qpm594gwmxh8osoakqjqaparz40cwl5kog+bmjpybwfio3zmaaap8d0wwg8jmz5dzt1ymgfx1cejbkahmjbhzwwrf0c8okatgaghwycbebjmp8soq2na5e/hpl4ch9qapageouj3zdlj4owasahorznhc+csrbsepaounxh1myovkeeiahw5gfpamrnqtglgf5/jxjsd4pteuawwlialmwadyanmnsam/u0fwbpioia0afqawkzegubrq2ktyhewdgbfocfg/mbnhffh+q3vreksgbicjmttqw7d0q3ahhvfz2vic3dylsfba2c7wea7iudbyna+isq1gnsuyg0lkck/wjmb2do8p8skd8dknxacudmygbc1ocxa3wjggnq7scehdtfahu7wdlvo4xeib0tijudpe15mvltn9dsft+ixbbfrzqaxajevu5w2hqxwgfu9hlzhds2go03wblot3l1qvo7rgrarkgpq+jqm38btt2kuzqaxab+894cznwxqfgyanh9j82dkoutygt3anb5dyhsm/+qd3qvpjk37irammzhcude8oahzgpxpqbmvfljsonnynjrkbn49uaizwl92le0bv/7rts2ndnkackc+tc6tmz7cgg3arbvfbls2afzejl2bn4tupqav+n5tlpp5dwfqg1prpqarac/uxyotpeiin9x1eesptjfdwb7mcjtiohepdxsm85jhb5gvtymgsuaicnb1l0i4h4and4/zmiuboa0tsp/13cxgxtwsno/oh36374wtsnnhbkaeoeta68d6nuowuwx5g7yhrcblgdowvwgipqbd+klbl8etsxnghkakodn674ewm3ep2dblr4eawwl0kp4qqkzf9yx3pf+okz1d+kdeocayx5uw9bydwbc7fkz9hdswtojw3wbfepn36avwhas0dwme2tfrsgbcjdrvhzje2be5puzoy7/swcr1huht96spxa4hxpnm6x/iqgk10+kahjdy1+6x/vkz9iljbbhnlatfw/s6p1rwfq0s3pqbyusgkdy+tbxqfqjt22zyrdfgcy9ioan8tcim7sxwk987vgo7whulaaeag95adwag7y1lralt0gwtwzqu5lh8o5tra2ffyxqoxorjqa+m/qen+/01lrcgvk7plkzwkmaagns+li94cavrg1ho6hwvj7cb66dawtpadtt3phhf56bnn8kwbiggvjm2oztukd+43drm9ioka/aj/hv96zgikc8tx4w7ojzavjxc5se2f9zfmf1w9smnapkapxiwss3ve7tl6vne7b1kqqfzt5nifsvo7ajuvac4ao8ee35ah3as1tp7obd2hi0sq0nmz3vstf845eitqmrudgaoue3783bzr0ixlzxtvywrpwt6j2/dxblbl31kanp/o0qglohygoof6vlvi+th2yrtt4+wlzwrnkuh0vtr9jralahvpmbowd6lje2duh5rfbuitns7xqp9eqn50dtr5jralajzewg7s4akbe20twbab4zglxnboon3gejtiljkagola0plwzwmms7nkfz+rwbwpzql/3kdbdgbudsuqjqa8xme+r2u9i8xtyiq5q9n2deo+7lglb/tfryuvyj8hbob9v9arnpcla93gk9xfbeqa0oaagfel90b8swixugsvtcwh7wfixv7i8sgcrhzq+eacb73dpj4y2wnrcgsqoabofb7q1fvjzqo5kgeocqez91bcjyt26/ikxydt8utq1jqwlaffbr66fvoalbewm+bzbqniuwkdbath7pppopvg1glabugy6xadddmsnyphcmcya0lldxzabsm80hcztumlaaxg9mxb6wa716afzew82xbcj3pld7wqblgpqssleraibjxlza9ucho7yhssgpwco8ze3rai5zayenlsfyu4hudigp14mmnt86+qfati/+d5padqhfevflc6o2iykoafamlxfrwbianqm58zpyj0jmvg7qz77zwsujojztiraqijt7m1gbkbtuesazfizb9nqkp/hqbts5gjq9qkidbhfzypeuid0mge+fal4usjv/t9q2jaxlaxianz3aadbjru2mchf9kdynmxl1xcnpukiod4cn0uh+pntpih1oqdzgadtd7fzsz+zfbucsualgbb10cgdnqqlba+g++kvpa035jjcapvf1aqej/ap/hombzd8oik5qtiwsc5nlo7yhcsgb8alrh9yaslmndetgysya6l4selmjr1sgzh4alou7lrekohulidqcttfyyuptgaeuahib3nn+2qon+efzyyg6vgbuoqybvyycgqtyiqfbfqdc5ycyhiyrcuawkwvffpugbmaf5kc1mi50blqg28ob20lzo0cdfwnu4wuzdmiriu99sdraucsa7qaflywpbi+08avxz6k2i+4oaxbjw/kgai43kjr3i/csv8zhom6lafuirvggzggwqi5zeqhlczb21rdkimhj9n+i2oq4owtadruhuzvho+csv9rcik5llse/tcalqzvpeesaqxoalgvreewi7sba/fabsgdceb4eimc0x9i6ibqxv1zzs7qh8y5rfjcyab0mtk4gqhgcgytne6o2ie4oaxcdxasa7ecq/via1l0cejvowmjwywjpy9whoavkxqvkt/wnv4hhtuzfbupcuqlgbpnjzx+wi/5nwhfqx8cavxkqjovdgg1vvf4lzadeyudb9sd9yf/7dhtia1runsqdtrxyfxb0iypk/kowk0etlxop2cybjqcljco0oh0hkb0eiv8xsjnx1pzzqrbrqjggegb3ne+idcd9j30qqknybh9lcs6glhiso4dmeockgpexwhwsyalzakwjtidukafwg9dudl+z33n2jeadi99o551otd/x/v7hfib1kpa5bcsvg0t/aux4h8vhbdtu31yoaxchud3p9riz4etwlhsvkj5detyjcnimr2nwhsqw5goz+qbjadsb88xrf3z+w9spvdeuf5qaueiuswd/1ugktqk1o2xhzwkurvhtadwsamwcrugq+i8ajagfghvbchcgb0gyh8wfqa4dxarzptlogxt8rwmao87rsd9p/wk/19n1l+xre98fjawaaow2ag2amauigqifhx/12yifa8pfqhp2ay2uz3sm+knawub9fu2jeoc6sx3pruxackdyg4yt669ogjqa1i0pbmbmycbzsoxrtgmycquwkrobjqd14soaxlse5nhdltqhi4pguaiqnfpm56e/tablpf0vwaaeigko7rq47jmoncebhopouaiqjsilyh5d+toz2fsrf0vwkagiego5oxjtp2c0nld6l60iecuaeuitjztezzpknxokpkmjqesqpgvihvjxokvpe66/qjeejqbrufeorz2op78ibfquqerq5gjh607bv96+itzw6c/w7asbaqbhhzefl150jg6yeu6d/6jhv/iheoaoedkg5xbgh8v9j/tah96+ixzh1nuqh3n79ebfn9qal17zjntvvhatuyf5bw2sxlf4i1ocracl51y+3amaw1bf4p8dj/5iv8k3rn6kiacf/yvfjlyk6vev/qieiarsbzlftyvv/btzuye+tqlwizwt9fgkf1eceagumud4na0ao/9rl7+ienxf1sgbcbvsgltdexzmjq//jj5ifsvrxx3lkfpge1gpr/axjqahq1o3hgov0obt7r9llzotba0t7/h5e2slllt8vv0guhd1+ap/uqiqnvomx8vmzgvgdpgxgbfffc3ee9kryguzyguzen/jr+h2w65bd1fwx3pfpb7cx9sqzqxess5xm7458poq+qo200htlz+uxcqay01c/cfxmoba+tj16h53qhkayan1ol938qaucj9rahaypdlvlgez8oefiqzgcudycjedcmgf+knoapqahawl5/mqka51/xunirkakcghaicaj+cmkbqeuaiqnussf6ucaewikaeihzwaqygpsgdibjwxc6de2ieoeocwct1mtjlnqtp/7tggbcbkmj0p+schoggntxn7pxhrzhdbjba7h/tbzfwuboblt0qoaqgztgycr5pwvf8jqr2bfjbne7dfhdxjff0071sc5ugotwg6lacejbxb+brqwrejhpdsjdqepkmjqmiw9zbjddka2aowvu3bsfecedbwm4b0oprd0wfqwkagewc+eruvtycsglbhctzed26joeclnciksqowqgqoaygco3jpbqagpe3lmmwmaznggjimgbv/tibk9ndguexh8y44o6t0hnc+solhijtojjyfq3hymuuyw0oqxuieawjby7vbz7xcfbcdwyqmwc7m905+kcki1dyr4cylapf+gfdfcieubxabba8bhkpai8rolkcmzhngqn/eyq+mps2twjcmoqhhjzqzhde0akswvf87ws7bgoxfydv1hanylq9hfyggbcaiuph3x+uuztbur10ugm1zwmvskmho64fvyi+693v+jy0tviepo28xpdfxgjitc3apujnn7kzvckzfhstqcrarxhwoad+nyo1a0roakibldyex2+fuywd0kw8vhofc9ztubmoalm2t+nnokab45hff+1r4r3kakwebbyd1lwgo0qsiikdetsothjikfughbcbceoqjqfy+a4dswcdthcdczwqnglr6nscc1qurufjduqokf1ec4e5wjyc2wpnhk18naco4fxedj0i3qmv4pfebankwcj/fhbaj4lyvfe6pur3duh8hd/qc7jwlfwictgdtogvsqsspslv3qs+1w68cg3qudak2n4/9egwu/mtfpsdbwkrtlhjbcyarfkgagg3iwr+h4is2ilc2+sms59qqntqjqio5iisg9kqux8vkl+bvaa7xghtp6bo/dlhsrqmak+ysvucdxhujnkal9bsobrdeplpide2d3tooet6/ahicems7ml1tiyiirio+opxx//t9b7pz9rwfeg3ocufpme6t3eaaql+wpw/+hjsab6qonnimba5sgocs8qljgn7sbj3bbmkzkeyz0jrgtyg299itczdqifqurdodoaedk88ngbh5okdox4+vfs2cgzklega3mj4a+nmvrwsdkh5usrha/etbu64hxerpxqk1dodz/budh0aaskuhuv7kgdqeeaj4mgtdrn8qmcfdgsi5qcwag7p8wuky+aihbpdc9q8fmpftnosaaj2uzok5bmd+a9jeetqqznlhqhssosgbcieowlefobcqnha+v3izxgp3r6/8lndsojaohnumiea+c5t+hn6iwmspvwdn30ibmkeoafdg/zuuknbu+2bcehe89enuejnaqtsojydifcaqga1a8vfhjkodaoerb5qaemgq6wbm+eqp0l7+euhcx8d9d6hicicvaexaahnbpwiqzwcfn4y8rocwzx455eetiriad9ahk3oafmzca/oubpuk5tilkh33vywhrqksrgtn1dufq4eish4hlmj98goashdvovlfftn0grnido+cmglbnwj4x0wkkqnmcwaaldebd38lmcoez/quqk2z9vobqsayvp7fgpgxkayh690rihg4ksgb8agddpkbypr2rndeenqgy7m9ann7xxdhj5golkbcg2jtamx8tdwtcteajnwftt6izhhktx0idcgah11vin1ralanvvprigwe/2ormg1q0px8lfdgtyb77504d4bgnwuj1s5odhcrdfipa/n/cyt1nn8cjfosxuxefmngcsujyerywvseehfavweq2ffnduf5sgnroeaqbsq9d9t2iubm8nrnbhslsfeazp27fj1tirbeaxd/xp0urv8rejnzk/tdv74uqimshxkaguata68d6k79fialsiz/h25pa0qdor4izhit7/vnbpslofysurkq+9gcutoq5x8dzprheon0gq/rc25ffrudsumtawqa5qz4dob/2e9noguimz9cq9gag0xwcb+4maxybvalercb0i2gtm5qbhkgz+rbqeqakwbbnfda/sam3h2xmpyumf5nnflri0ah42rbc5z/gtevgwhhlrgfazn5ypnnsf25yk8wjd7p2synfhfjz0z3dorp0qlpe/ynpdkjb5oyzca0wdj0xyiqausqpglreadsitcjvpse8afu4xd8igo7koosgdqgucvx8oz1rrd+gyagetbyj8dkpxhdktcsweuigciybgo4hyldakplinkjyuasnfa2dseeic1i0wlybnk2wepikcgwbwkwyrcltsufbq0rhd7zz/qcfzkvalosjiob+abvxfsemk0hmb8aplendug5cabp/vfhy6xdzoer1ks2tz7q/ieckgsjbczntco/9p3qb28wvazab2j2iv8ei5mbraugrxowtjbdozarirh6le26pu1qnfn9qqmat9dcs/tpzvllwhqmib4tmfkssodebvadqbb69y6rpmsxfus3d6ejbnsjaosabrud8bmau+xfait588mnadndpkmizaldechtr9wg5knaplo2qrtdqt7vb4okaqqmb3q0q8qxvyzn7z9ia8j/et0ngamgajeppfnfnt33otp4zsu+d6dyixkakgbmsl/76ko2hz4le/drbjf9wx41igainunr3cjq+l2x4it/trrylfqoabuecakiyowwfrmf/7ymj1tlx2aulpny4gbis0mfwedohttak76vtbffqrnu6i3aomajsw+8+mdp3t0lmzs+jwv+maybw5ll1wuvjc0degljytimijyf6dljd9c8g4m1uogieoaywbxg2bvpy5cllbdz75zycdkktd93njqnvlzdw4bxntz1so5bb/ocmlbly7udfabqnyrprfk3zpqijjpux2nvejj8opgnnjbohyat+xsqwacdfsja5d7hb7ueibfeaysax/b8a/7ths2brnzet7wnfphm7cyrg7eyrb0d+2v2m6/34f3zukb2yifgkmda1eorbwlbuathn0/04//9uulxbsz3pe35c3i7jz6s7zfzpzd1fjpqtzahacrqqhkameotl1xxgj3spwdggqdowj7dhzv49wffh6vllwttnpgmjka8adnrmlwyyoh+274falasg/19fbdm/vochsakpulv6nrqcv3qfet+8r3fbmkqoiaubxax4ye8dcyvdezgrozyvgno7qdauob8f2b27gu1toix82c89cyv9/5m1zvmnjiza/39kjfethisthtsnmazhremwlklzrhacukmuaiqmvvo+ph0944gznnylkcyb8wy2djgg2vii4ctzunamh8iagd76/sxrxjcohvyzawndmikp3fcqglcvfacedb+t/jxgouydgbymg5k2if2bnvyjjzwenjz0f1mb22eualspi4o6hokg4odfq893tufeoriuqlgm9ctvxkujo00ed4exqk2yz6fe348lmghcadmwpq5anm9fvwycmssmdd/jp6dlq9ozrxmogk6bvr7iasoszzeed52xgwwnti3c9j/o6xo/od+9igq+okjsgdqzngirdquvmfxjmt5thsezd5p78uqqqy2tggvy9azoyuky4ecgptzfwackae25vodgfkqwxyzi5nny/lukrmgb71i21k3bengwdgyrvz1stm+auq6/qku6+unfuvuxx57tl1hqamladvy7yqrjgxtvqbdcky3a6np4tqxlruwbsgdtom8lu8a6o3dlanmagbkjgc56zcils/vbcu+7ov6a8dg7j5pn6suhkwv27zstm0dvy7jocrqbrefvejztja6dd3p1v+g7s6becuavbbq1aquxurlmwk1jn7lr5+2zcmwdjtlzrigguwmg46ojqq8h56t2/ckaaay0+ehzfd235yc411/ani5bbvnz3sjdtycm1o5xdqujnl3f5310byupx9p1zo+/d2ffne/qrocjqaewlrouxpqpvsslvbndkoryd+2brjltye8bb3trnd0tekurfrdpba/vgvhvufk/x7m21jgnou/d8w3qg82vhmcrbbttnpm07rk0morl124+afoth3i4ycfdiyy0kcogido0dxlp7f8cqzre4mfbfd15gcwjhizq4pd2nwzcz07ejdqp4biobh38o89iwuz/acw/y13nfwydylql+nd/zg2vv7b24zcaw7d3znh6xeggg3b+kihuli0m9+3dogiu6hucueub1cbvutwldae7tzz+q5qtnnccasaqqeidiiqqesaurq7oadq/yp2bj3yha93ktcr6z/gzq3bauot8cc46izts61qkf276kyllmzt2stujgbilacmy9girekpma6vavgsqv37mfaoffeygyfpuu/nz2tt6ozqqvtpwmypjjb3nqcfmpccfvx/aicuki3ut8z2ozhycdm0oyzt+v4l5y76s92km9vbg/1r7te+rfqyashktnctal6akid/ovdarp4eda4mejr8frvci0mth9br61kgkuspacod/iytx5y+rw05x/qrbinrkpbey4pwzmufwxz2oimldcuae1i9/oornq1peldhstcxxuirptt6mng/cmvy9ptt6jiejs7qiv1u7n7ru/gamx3e6mlahnfy/qfg146dvdnmxqsodt//hhnhmvzujd/086ull74v2jgsgxiagfyvw7wgme8d4plrzfsw+np7mda/anv2nvhrdfy5uwlb7hjlq04ahidai06uv8exaiho4oayzixcoxdlxwcvenrnmjvnvwruagh4/pllrddc+on/w3j7ec8vda0oy9fo3vwtxcfwvjlsumo7vbdtttccr3tdcji5/momtwlyi7hgyd0bua+uy6xjxvrp57ctwbjkeucdxzimfydprfzzocitvygic7x+xrys7n61gyp5plikf9lh3ng7trg/ld2wam6u/xhbeabjbc2u+1iuladbvawnl19w+ezab4sptskaqxat6ijbqv8c3nfzfuyk2nwzg6zrxewdsfzbvh27plwrubtw4pqp4zqe5adhbqeb0q1e+elgsysvxdkv8mfisnmjwgdwruzum/g1mn7t9tpdg0myhbge17dxp5vnhpou5ealpyax1x/wlgtkf+k9cu5by5pm68ji0ppn6ak0lqcswruqvbyy32fgzpfwggrgf28/8vnaj/sehbjyjunicwmee3tglww8uv6a9ysgemfmda1m/gozcezlbm0xb59btghrw2idxocmegctglsapt1lwykzfbt6usqv6hrtti3kh8pze9jtrylo3qvafa4/uf0sud3k8yow7wb2cvbcnm0okzdphjpoxdsnafy77oovavjlpa2ujl7exk8berwq1s28vyr9+tktgzzgym+u/94xakgcqpywrxm85zjx2jkfi38wyear0bqccn3sq08b+j+9tn07+asm9jkrljs7uvkqe8bmgz27/mpumgrudweumyaiwcieu/t8sz4bmqeh0vacco3sa7uk4hua3hfbmndf1+fr5b+jvcqhxaqgsoc+veok8pn6koc8embfyzmdxdlts89bemjudgrnwwsacfk/amzx0nzwcbbgobjelkcfbhutgolchyqgj8io/dkhbvuzznljudsrna0tancs+8sldf7spw1+oi9cgdc3em7atljskc99+5qevikoan9ogiz5wnjzl/5w1hyescmkwbvxxnfoog96avs2dawhohh2jeib3ckpqf78tglalygdf06ujpl1kxatodbqo4kiyqugbej/boaat3zssgz2dyrg0shbu7lbbtmnsu+oa3+vklytjjfiwxytaugbwl38qimiun5l28h+qc/zfh4rzkdllsmohojkaopl4k8spvlp3zddepfzudsrba0pajlpjngo6feqfove6fmrqt3xvcqf1uoqhkccan8vyabusu+j2owgadgbuhrp1ycsydxwx5ixfhbqy4mg1rxek4jqiygkolgf/iprlpfnn6ix0haciatfda/v/ppdw7cdfgxmgsbufq9jqdusrbjqxan/lsix7buitsfvgkoavq9cpqpaxw7tlnpy9yckwgnk/fwaffqnqsqbxtxwv4lsuxzoko8sotzqo/ykoqsaleskacm3dvnh6gp6bekqabbqkok84ncsunwdfxpcagz761gb4senjaae4hk3rrzlovgshmcod/x+elatfos5tx+tgbir+kuautborapnm4b5ra679ort4ehknueyrjn9xgtxmxtkbt+tgjis+jsi27ztsxze/kmo7fclhheasfwx1za2hbun/xh+toogkol8sgjkwubviti2xt3npnaoakamno/wqfao+n4opv/46rb7nhtkyxjq0gj/e2fa1pfoklntel/etuuvopgaww7tioxoi/9osb8nhp9jqx4masv87gmypyd00gsuushqo/ygiqqamnaow5nyuez55j6oag/378aqp5oc/ewc8vn3jbjp2vdfbymfniyaml/frumpgm2wx6+kmxlfq+d6uw3xz778/j2jwrblcvhb4aeniaaed/x94/7o2e8no59jqx4natwcf2cz1rsobfcdxavaqstwzqcwxamnazqhz/xvqxbprt+tgvxoamoel0bkkzacv+qforajxhivajp0p823hfhgn1ececl6mrqurbjqi3gbjg3px8rflcqlajg78/msaaajduleqvtmuzuxyv4x+fsloj6gfiufbxusuen4acqlorahxhpaaoq8tyz+1fcpgicfhh4kbqv5eldsvqc2mtdqg+ol+qiaczdtvduyisno+61e0e9bp5kcgjwjkoleaes5i2ob6qubbiadnwa169mf8ccpkoitgjlsbugp26o2ov6slwaexy/bsukzdblg08+ppkcgtwjkshfazk5l5+jo8guacdxe3rbj6f6h8etziyko6joagor6acyc+pmteawdqwd46whmmt8xp599jo45+xhmmt4v2wzw1/7jxm333bg1cy6usixs3rklz/3tafzhl36fla8fu7l4ipqaxapho22ltxuauqkuvqy+emeefzaiyjc+ffwtzwyxa+5szjo7gx/+6el8+qe/xipfus+upr83qgztiwia42yusv4vkzvk4cu33ykjjj+m7r4uwsgewfkfoqchzpmfr//jp8u6abwxeu/cuoghsq9yfawa/aniqoopwfjrr4jajesgbmcfa+foxpnnn+2tnyqwoosj52d2qynfpxm4sgbc+paf56o1fwihipx13oejnip2nlwa1msxjzrugfim4kj13bmibmcfydonrm2cokamtfpfnrun8byguhtd/u9kmammwezsa442j9lk7jame+ubuobwssxkxggac2ryx44gee8fneoaxciojdhfd8korq3enas0tigbcgheor6+cvnjtzzlwmufjqaufbw8adx5442tdgk6ogtahaldmelqjxdvtcoeqebxqt3dljh5agp7ulwxfaij2ogoaxdbkqagidflmb8geweualhqdbaa5qhem1lmz4kma0oaxci43erkbokl23enualgssehcagoaygzxef81cbehiualjgfaqelahem7+mr6y2kegaxci5bqcua8wv4cchqe2kpegax3dwaqfobswvoydbqe2kpygz0wc0dsjkcfm3gzjlqu5yosulrht3l2kirsoixlsmwptp6343ayn9a1cbehiualozkxtyabfcygrthgfulvm/25bf/x95i5ahsnireggzmzagl2inxqtc/uzdqe2kpegax3lib4z5fdpqzzwxk2b4tfxjaw2vgj8e4vkngeibuv2fl+nf5f6x5o5ekdzysssws4+gifooc89cljl8pej/8+2iz8osaxouf+p5+bqgygdtkafxgzhqllbp+4/p83flmbbiupx/+pwgjt8ojfahm2j4khseuahjaarkqrweo2oynb6vv6crpdkquanejokrnfk8oafcau0jqhaxg1tzx5pzxwmbg1zfkcyaqbuinjqaecnwleln9aewbsb3k/2tdvus9rw2tgcog4g0lab5iulgqnevgkhuxgj4epderyideinv9g0usvbskpxzc2jfivv1gfqpxhhiadyspkehbbidjxqd79htvdmqbsga8kksiioua1+ljiggoyideualgavuuzjqk/z6qgig3lab4ielfqbib7t8psm+/ucvavneiamaepucsiolkrhbuepb9+00yxuaovt98btscaare9sfjrugmzol7sqdlk3o7hfemhaql57vibzlzjvbm9aahsfjrkomzyasjaexlb9bxqisrccq0lfgbhsqlabm9hfqyssok0qirzrx4lwgzwyhrmyawiofomryl8eecjk73bo3i/wh6bfcpigyc2krwc67qbbzsmpzjdwadvcexa9f07zebdxiwircauur9fecgm9rpkzaqrxgambqtp75d+gbxsr0iuu9/aojf1rdo/0sehlv9i9bbqidxand3y3fnax4kydgkxslyofbhhiuctm8qfrtx9/usgcpabwykscrqyh9/op2n0+kn9/34vp2bdhicircaajbsfanayolfss0kclcocfknqgk5obnwuqfaqbm4/nyohfamjj1kxrpoachreajw7/p7xwxwrymukfdnbk5sqtc+tm8qtp0smkff21trajazq/jgzifpcxzyawi8gegmm/3zup9877ebdhisdvmutkgbn7dymq8c/n59f64jdzaspzw0kc8a0ya+fvdpktuir08ihnzk6nltfrw4rix4i2bmywpmtydrx99eyaclgars+rdenf5wyaoetmmiwamppfbavxl1r9m2/glg7lgfz7jpwhkfbmctkegm4wdjadeic3pa3jwwtsmbypnb1alqhlbtuzyppfzwww1z5fbdlahgupubu3ea5hkmbbv7ws6x86vvp4zahvojngbwanwane3yuwzr4vu/xp+k751hsmpdu/esve/zvmo8kyhfaycesihx1lp3vyp5ysklyxaygw+j5g8xed2vgm7n5u5c97p1p/c14xjqcaiaahfef/+uvffmlbddcmcko2msmplmxx0mqshis+nnmzbsnvtezmrlrlu//t6zvnuaixombjceo++8swzglturv9/dlnvz95tufymdg61u23orkasiim1ovcvaiajptoqltj6+tlgi/zvowaey4+4h7t4bypxqrau/2nnrutcby11uhbk5xttmkbzt604bfpbfs1gq+icbm4nqi4eiiasmiqijbyuw0v69ldpva4rnpl5qdy+pgmzxmpm9la4pmypxuaenqgzy36fpl0ztrxjoybhaeddgmf+qldrwqgobpaiewcnkajkdbnsxwb5rauarzuua4lqupnkhixqitiepkahwihqrapwhja8m7ijahqsg7lup2g4egci2codnqg1ickoapnkiygcjqd9nk7jcgsua3hkgkr/pi2nrkgylbztfo3w/ualgesjiabxlzcgpib4qwequxd5wg6eeodo2vrqgbcaeceadcvqfsgcqgblibwilapfaed0ttq1jqglafbaq/wuvag+qfqcxgihuidqgjkeeoaqyrbvbfmde19qfmnrsre90egv+tkqjor5bvclmush8qwal9/s5gch1jiaynkkd3utzimi/ygbnghpwvqkrwwmic4n5xweeu3xourup5r+qyv8bygoogxlzyulkvux0jocdbpnbo7apgscacshrrm+nig5oi/pv1dypfaqfqqfqkbqkhukhumsz/w+sdhbtagc0eaaaaabjru5erkjggg==\"></p>`;

    // const htmlString = base64;
    // const result = htmlString.replace(/<[^>]>/g, "");
    // console.log(result);

    const uploadResult = await cloudinaryFileUpload(image[0]?.path);
    const uploadtopNewsContent = await new NewsModel({
      HeadLine,
      author,
      StandFirst,
      NewsBody,
      category,
      image: uploadResult?.secure_url,
    }).save();

    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          uploadtopNewsContent,
          "upload NewsContent Successfull"
        )
      );

    //Now update the cagory db
    const getCatagory = await catagoryModel.find({ _id: category });
    if (!getCatagory) {
      return null;
    }
    await catagoryModel.findOneAndUpdate(
      { _id: category },
      { $push: { News: uploadtopNewsContent._id } },
      { new: true }
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

// delete Top new with params
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTopNews = await NewsModel.findOneAndDelete({ _id: id });

    if (!deleteTopNews) {
      return null;
    }
    const delteFile = deleteTopNews?.image?.split("/").slice(-2).join("/");
    await deleteCloudinaryFile(delteFile.split(".")[0]);

    await catagoryModel
      .findOneAndUpdate(
        {
          _id: deleteTopNews?.category,
        },
        {
          $pull: {
            News: id,
          },
        },
        {
          new: true,
        }
      )
      .select("-_id");
    return res
      .status(201)
      .json(
        new ApiResponse(200, deleteTopNews, "News Content Delete Successfull")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

//update the top news
const updateNewsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { HeadLine, author, StandFirst, NewsBody, category } = req.body;
    const image = req.files?.image;

    // Check if the news item exists
    const isExistNews = await NewsModel.findById(id);
    if (!isExistNews) {
      return res
        .status(404)
        .json(new ApiError(404, null, `Top News with ID: ${id} not found!`));
    }

    // If there is an image, upload to Cloudinary
    let uploadResult = null;
    if (image && image.length > 0) {
      uploadResult = await cloudinaryFileUpload(image[0]?.path);
    }

    // Update the fields only if they are provided in the request body
    const updateFields = {
      ...(HeadLine && { HeadLine }),
      ...(author && { author }),
      ...(StandFirst && { StandFirst }),
      ...(NewsBody && { NewsBody }),
      ...(category && { category }),
      ...(uploadResult?.secure_url && { image: uploadResult.secure_url }),
    };
    const removeCategory = await NewsModel.findById(id);

    const updatedTopNews = await NewsModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    // If Top News is updated successfully, update the category as well
    if (category) {
      await catagoryModel.findOneAndUpdate(
        {
          _id: removeCategory?.category,
        },
        {
          $pull: { News: id },
        },
        { new: true }
      );
      const getCategory = await catagoryModel.findById(updatedTopNews.category);
      if (getCategory) {
        //insert new id into new catagory
        const updateCategory = await catagoryModel.findOneAndUpdate(
          { _id: category },
          { $push: { News: updatedTopNews._id } },
          { new: true }
        );
      }
    }

    // Return the updated news content
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedTopNews, " News updated successfully!")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

// get single getSingleTopNews
const getSingleNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the TopNews by id
    const topNews = await NewsModel.findById(id).populate([
      "category",
      "author",
    ]);

    if (!topNews) {
      return res
        .status(404)
        .json(new ApiError(404, null, `Top News with ID ${id} not found`));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, topNews, "Top News fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

//get all news
const getAllNews = async (req, res) => {
  try {
    const AllNews = (
      await NewsModel.find({}).populate(["category", "author"])
    ).reverse();

    if (AllNews) {
      return res
        .status(200)
        .json(new ApiResponse(200, AllNews, "All News  fetched successfully"));
    }
    return res.status(404).json(new ApiError(404, null, `All News not found`));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

const getAuthorAllNews = async (req, res) => {
  try {
    const { id } = req.params;
    const authorNews = await NewsModel.find({ author: id }).populate({
      path: "author",
    });
    if (authorNews?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            authorNews,
            "Authol All News fetched successfully"
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(404, null, `All Author News not found`));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

module.exports = {
  CreateNewsController,
  deleteNews,
  updateNewsController,
  getSingleNews,
  getAllNews,
  getAuthorAllNews,
};
