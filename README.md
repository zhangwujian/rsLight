# rs-light

> 基于vue 2.x的一个字符串模拟rs尾灯效果，可配置成跑马灯

> 组件:  rs-light

> 版本: 1.0.1

## 使用方法
* 通过NPM下载安装
```node
	npm install rs-light --save
```
#### 在vue页面中引入 并在componets中声明该组件
* xxx.vue
``` vue 
<template>
	<div class="rsLightDemo">
		<rs-light string="rslightdemo"></rs-light>
	</div>
</template>

<script>
import RsLight from 'rs-light'; // 引入
export default {
	components: { RsLight }
}
</script>
```
#### 配置参数
| 参数 | 说明 | 类型 | 默认值 |
| - | :- | :- | :- |
| string | 传入的字符串 | String | 无默认值，必传 |
| during | 动画持续时间 | Number | 默认动画时长等于字符串长度 |
| light | 高亮的颜色 | String | '#000' |
| dark | 常规颜色 | String | 'transparent' |
| className | 主体的class | String | - |
| itemClassName | 每一个字符的class | String | - |
| direction | 动画方向（forward/reverse） | String | 'forward' |
| indexClass | 根据特殊下标控制某个字符的class | Object | - |
| infinite | 是否无限重复，动画播放次数 | String/Number/Boolean | 1 |
| marquee | 开启跑马灯效果 | Boolean | false |

#### 注：
* 可以通过className和itemClassName为整个字符串和每个字符添加class，通过class改变样式；
* 通过indexClass为字符串中特定的一个字符添加class，可以是数组类型，（例['largeText', 'miniText'],数组的第n个值便是第n个字符的class；）或是对象类型（例： {3: 'miniText'}，key：为第n个字符，value为特定class）；
* direction的默认值forward为从右向左，想要反向请使用 reverse；
* marquee默认为false，参考的是奥迪rs的尾灯效果；为true时为跑马灯效果，跑马灯效果需调试一下dark、during、infinite参数，以达到更好效果；


