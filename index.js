import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import './index.css'
import region from './region'

export default class TaroRegionPicker extends Component {
    state = {
        region: '请选择省市区',
        // H5、微信小程序、百度小程序、字节跳动小程序
        range: [],
        value: [0, 0, 0],
        // 支付宝小程序
        list: []
    }

    componentWillMount() {
        // 省市区选择器初始化
        // H5、微信小程序、百度小程序、字节跳动小程序
        let range = this.state.range;
        let temp = [];
        for (let i = 0; i < region.length; i++) {
            temp.push(region[i].name);
        }
        range.push(temp);
        temp = [];
        for (let i = 0; i < region[0].city.length; i++) {
            temp.push(region[0].city[i].name);
        }
        range.push(temp);
        temp = [];
        for (let i = 0; i < region[0].city[0].districtAndCounty.length; i++) {
            temp.push(region[0].city[0].districtAndCounty[i]);
        }
        range.push(temp);
        this.setState({
            range: range
        })

        // 支付宝小程序
        let list = this.state.list;
        for (let i = 0; i < region.length; i++) {
            let proviceTemp = Object.create(null);
            proviceTemp.name = region[i].name;
            proviceTemp.subList = [];
            for (let j = 0; j < region[i].city.length; j++) {
                let cityTemp = Object.create(null);
                cityTemp.name = region[i].city[j].name;
                cityTemp.subList = [];
                for (let k = 0; k < region[i].city[j].districtAndCounty.length; k++) {
                    let districtAndCountyTemp = Object.create(null);
                    districtAndCountyTemp.name = region[i].city[j].districtAndCounty[k];
                    cityTemp.subList.push(districtAndCountyTemp);
                }
                proviceTemp.subList.push(cityTemp);
            }
            list.push(proviceTemp);
        }
        this.setState({
            list: list
        })
    }

    // H5、微信小程序、百度小程序、字节跳动小程序
    onChange = (e) => {
        let regionTemp = this.state.region;
        let rangeTemp = this.state.range;
        let valueTemp = this.state.value;

        valueTemp = e.detail.value;
        regionTemp = rangeTemp[0][valueTemp[0]] + ' - ' + rangeTemp[1][valueTemp[1]] + ' - ' + rangeTemp[2][valueTemp[2]];
        this.setState({
            region: regionTemp,
            range: rangeTemp,
            value: valueTemp
        }, () => {this.props.onGetRegion(this.state.region)})
    }
    onColumnChange = (e) => {
        let rangeTemp = this.state.range;
        let valueTemp = this.state.value;

        let column = e.detail.column;
        let row = e.detail.value;

        valueTemp[column] = row;

        switch (column) {
            case 0:
                let cityTemp = [];
                let districtAndCountyTemp = [];
                for (let i = 0; i < region[row].city.length; i++) {
                    cityTemp.push(region[row].city[i].name);
                }
                for (let i = 0; i < region[row].city[0].districtAndCounty.length; i++) {
                    districtAndCountyTemp.push(region[row].city[0].districtAndCounty[i]);
                }
                valueTemp[1] = 0;
                valueTemp[2] = 0;
                rangeTemp[1] = cityTemp;
                rangeTemp[2] = districtAndCountyTemp;
                break;
            case 1:
                let districtAndCountyTemp2 = [];
                for (let i = 0; i < region[valueTemp[0]].city[row].districtAndCounty.length; i++) {
                    districtAndCountyTemp2.push(region[valueTemp[0]].city[row].districtAndCounty[i]);
                }
                valueTemp[2] = 0;
                rangeTemp[2] = districtAndCountyTemp2;
                break;
            case 2:
                break;
        }

        this.setState({
            range: rangeTemp,
            value: valueTemp
        })
    }

    // 支付宝小程序
    onClick = () => {
        let temp = this.state.region;
        my.multiLevelSelect({
            list: this.state.list,
            success: (result) => {
                if (result.success) {
                    temp = result.result[0].name + ' - ' + result.result[1].name + ' - ' + result.result[2].name;
                    this.setState({
                        region: temp
                    }, () => {this.props.onGetRegion(this.state.region)})
                }
            }
        })
    }

    render () {
        return (
            <View>
                {
                    // 支付宝不支持多列选择器，借助支付宝小程序API：my.multiLevelSelect实现省市区选择器
                    process.env.TARO_ENV === 'alipay'
                    ?
                        <View className={this.state.region == '请选择省市区'
                                            ? 'taro-region-picker taro-region-picker-gray'
                                            : 'taro-region-picker taro-region-picker-black'}
                          onClick={this.state.onClick}
                        >
                            <View>
                                <Text>{this.state.region}</Text>
                            </View>
                        </View>
                    :
                    // 使用多列选择器实现省市区选择器，支持H5、微信小程序、百度小程序、字节跳动小程序
                    // PS：微信小程序、百度小程序、字节跳动小程序支持设置Picker的属性mode='region'实现省市区选择器，但本组件均采用多列选择器方式实现
                        <View className={this.state.region == '请选择省市区'
                                            ? 'taro-region-picker taro-region-picker-gray'
                                            : 'taro-region-picker taro-region-picker-black'}
                        >
                            <Picker
                              mode='multiSelector' 
                              onChange={this.onChange}
                              onColumnChange={this.onColumnChange}
                              range={this.state.range}
                              value={this.state.value}
                            >
                                <View>
                                    <Text>{this.state.region}</Text>
                                </View>
                            </Picker>
                        </View>
                }
            </View>
        )
    }
}