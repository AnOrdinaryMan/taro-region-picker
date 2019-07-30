# taro-region-picker

Taro省市区选择器

* H5、微信小程序、百度小程序、字节跳动小程序  
使用多列选择器实现
* 支付宝小程序  
使用支付宝小程序API：my.multiLevelSelect 实现

## 例子

```javascript
// src/pages/index/index.js
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import TaroRegionPicker from '../../components/taro-region-picker'

export default class Index extends Component {
  onGetRegion (region) {
    // 参数region为选择的省市区
    console.log(region);
  }

  render () {
    return (
      <View>
        <TaroRegionPicker onGetRegion={this.onGetRegion.bind(this)} />
      </View>
    )
  }
}
```
