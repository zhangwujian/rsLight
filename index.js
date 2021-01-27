export default {
    name: 'RsLightComponent',
    props: [
        'string', // string: 传入的字符串
        'during', // 动画持续时间
        'light', // 高亮颜色
        'dark', // 常规的颜色
        'className', // 主体class name
        'itemClassName', // 字的class name
        'direction',  // 动画方向 默认正向 传入reverse时为反向
        'indexClass', // 根据特殊下标控制某个字符的class
        'infinite', // 是否无限重复，动画播放次数
        'marquee' // 跑马灯效果
    ],
    data () {
        return {
            strArr: [],
            duringTime: 0,
            rsClass: '',
            rsBarClass: '',
            forward: true,
            lightColor: '',
            darkColor: 'transparent',
            iterationCount: 1
        }
    },
    render (h) {
        let dom = h('div', {
            class: `rsLight ${this.rsClass}`
        }, this.strArr.map((item, index) => h('span', {
            style: {
                color: this.lightColor
            },
            class: `rsLightBar rsLightBar${index} ${this.rsBarClass} ${this.indexClass[index] || ''}`
        }, item)));
        return dom;
    },
    created () {
        this.propsHandle(); // 处理props的数据
        this.createKeyFramesStyleSheetRules(this.string);
    },
    methods: {
        // 处理数据 类型判断
        propsHandle () {
            let {string, during, className, itemClassName, light, dark, direction, indexClass, infinite, marquee} = this;
            let stringType = typeof string;
            let colorReg = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
            let directionArr = [undefined, 'forward', 'reverse'];
            let marqueueArr = [undefined, 'true', true, 'false', false];
            if (stringType !== 'string' && stringType !== 'number') {
                console.error('string不是String类型！');
            }
            if (during && isNaN(Number(during))) {
                this.duringTime = this.string.length;
                console.error(`during不是Number类型！现在动画持续时间为${this.duringTime}；`)
            } else {
                this.duringTime = Number(during) || string.length;
            }
            if (!className || typeof className === 'string') {
                this.rsClass = className || '';
            } else {
                console.error(`className不是String类型啊兄弟！`);
            }
            if (!itemClassName || typeof itemClassName === 'string') {
                this.rsBarClass = itemClassName || '';
            } else {
                console.error(`itemClassName不是String类型啊！`);
            }
            if (!light || colorReg.test(light)) {
                this.lightColor = light || '#000';
            } else {
                console.error('light不是一个合理的颜色！默认黑色；');
            }
            if (!dark || colorReg.test(dark)) {
                this.darkColor = dark || 'transparent';
            } else {
                console.error('dark不是一个合理的颜色！默认透明；');
            }
            if (!direction || directionArr.includes(direction)) {
                this.forward = direction !== 'reverse';
            } else {
                console.error('direction 的合法值为forward或reverse；默认 forward');
            }
            if (indexClass && typeof indexClass !== 'object') {
                console.error('indexClass为一个key为指定index，value为class的对象，或数组；');
            }
            if (infinite) {
                if (infinite === 'true' || infinite === true || infinite === 'infinite') {
                    this.iterationCount = 'infinite';
                } else if (infinite === 'false' || infinite === false) {
                    this.iterationCount = 1;
                } else if (!isNaN(Number(infinite))) {
                    this.iterationCount = Number(infinite);
                } else {
                    console.error('infinite用布尔值表示是否无限播放动画或使用数字表示动画播放次数；');
                }
            }
            if (!marqueueArr.includes(marquee)) {
                console.error('marquee 的合法值为true或false；默认 false');
            }
        },
        // 创建样式表
        createKeyFramesStyleSheetRules (str) {
            const {lightColor, darkColor, forward, duringTime, iterationCount} = this;
            this.strArr = str.split('');
            const Len = this.strArr.length;
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            document.head.appendChild(style);
            let sheet = style.sheet;
            let token = window.WebKitCSSKeyframesRule? '-webkit-' : '';
            if (this.marquee === true || this.marquee === 'true') {
                let eachStep = Number((100 / (Len + 1)).toFixed(2));
                for (let i = 0; i < Len; i++) {
                    let lightTime = (eachStep * (i + 1)).toFixed(2) + '%';
                    let darkTime = `${(eachStep * i).toFixed(2)}%, ${(eachStep * (i + 2)).toFixed(2)}%`;
                    let animationItem =  `@${token}keyframes rsLightBarAnimation${i} {${lightTime} {color: ${lightColor};} 0%, ${darkTime}, 100% {color: ${darkColor};}}`;
                    let styleItem = `.rsLightBar${forward ? Len - i - 1 : i} {animation: rsLightBarAnimation${i} ${Number(duringTime)}s linear ${iterationCount} forwards;}`;
                    sheet.insertRule(animationItem, 0);
                    sheet.insertRule(styleItem, 0);
                }
            } else {
                let lightArr = [];
                let darkArr = [];
                let x = 0;
                let strNum = this.strArr.length;
                let animationLightArr = [];
                let animationDarkArr = [];
                while (strNum > 0) {
                    for (let i = 0; i < strNum; i++) {
                        lightArr[i] = lightArr[i] ? [...lightArr[i], x + 1] : [x + 1];
                        x++;
                    }
                    strNum--;
                }
                for (let i = 0; i < Len; i++) {
                    let arr = [];
                    let light = lightArr[i];
                    for (let j = 0; j < light[light.length - 1]; j++) {
                        if (!light.includes(j)) {
                            arr.push(j);
                        }
                    }
                    // let arr = allArr.filter(key => !lightArr[i].includes(key))
                    darkArr.push(arr);
                }
                let eachP = Number((100 / x).toFixed(2));
                for (let i in lightArr) {
                    // lightArr[i].push(100);
                    let arr = lightArr[i].map(item => {
                        if (item * eachP > 100) {
                            return '100%';
                        } else {
                            return (item * eachP).toFixed(2) + '%';
                        }
                    });
                    animationLightArr[i] = arr.join();
                }
                for (let i in darkArr) {
                    darkArr[i].shift();
                    let arr = darkArr[i].map(item => {
                        if (item * eachP > 100) {
                            return '100%';
                        } else {
                            return (item * eachP).toFixed(2) + '%';
                        }
                    });
                    animationDarkArr[i] = arr.join();
                }
                // 添加keyframes动画的样式
                for (let i = 0; i < Len; i++) {
                    let animationItem =  `@${token}keyframes rsLightBarAnimation${i} {${animationLightArr[i]} {color: ${lightColor};} ${animationDarkArr[i]} {color: ${darkColor};}}`;
                    let styleItem = `.rsLightBar${forward ? Len - i - 1 : i} {animation: rsLightBarAnimation${i} ${Number(duringTime)}s linear ${iterationCount} forwards;}`;
                    sheet.insertRule(animationItem, 0);
                    sheet.insertRule(styleItem, 0);
                }
            }
            
        }
    }
}