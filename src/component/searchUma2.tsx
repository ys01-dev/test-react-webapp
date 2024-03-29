import { useState } from 'react'
import { useSelector } from 'react-redux'
import GetUmaHome from './get_uma_home'
import GetUmaDress from './get_uma_dress'
import { chara_name_data as Chara, initCharaNameData } from '../tables/chara_name_data'
import { dress_name_data as Dress, initDressNameData } from '../tables/dress_name_data'
import { initUmaLiveChara, umaLive, umaLiveChara, umamusumeDoc } from '../tables/umamusume'
import { SelectLivePreset } from './selectPreset'
import { changeConfig, getCharaData, getDressData, getPreset, savePreset } from '../common'
import { SnackBar, sleep } from './snackbar';
import "../css/searchUma2.css"

const SearchUma2 = () => {
    //#region const declaration
    const strOrgChara = "original"
    const strReplace = "replace"
    const strDress = "dress"
    const sideBarWidth = useSelector<any, number>(state => state.sideBar.width)
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [snackBarVisible, setSnackBarVisible] = useState(false)
    const [searchTextReplace, setSearchTextReplace] = useState("")
    const [searchTextOrgChara, setSearchTextOrgChara] = useState("")
    const [searchTextDress, setSearchTextDress] = useState("")
    const [originalCharaData, setOriginalChara] = useState<Chara[]>([])
    const [replCharaData, setReplChara] = useState<Chara[]>([])
    const [dressData, setDress] = useState<Dress[]>([])
    const [selectedOriginalChara, setSelectedOriginalChara] = useState<Chara>({ ...initCharaNameData })
    const [selectedReplChara, setSelectedReplChara] = useState<Chara>({ ...initCharaNameData })
    const [selectedDress, setSelectedDress] = useState<Dress>({ ...initDressNameData })
    const [preset, setPreset] = useState<umaLive[]>([])
    const [liveChara1, setLiveChara1] = useState<umaLiveChara>({ ...initUmaLiveChara })
    const [liveChara2, setLiveChara2] = useState<umaLiveChara>({ ...initUmaLiveChara })
    const [liveChara3, setLiveChara3] = useState<umaLiveChara>({ ...initUmaLiveChara })
    const [liveChara4, setLiveChara4] = useState<umaLiveChara>({ ...initUmaLiveChara })
    const [liveChara5, setLiveChara5] = useState<umaLiveChara>({ ...initUmaLiveChara })
    const [selectedLiveCharaRadio, setSelectedLiveCharaRadio] = useState<number>(-1)
    //const [selectedLiveChara, setSelectedLiveChara] = useState<umaLiveChara>({...initUmaLiveChara})
    const [isEnableCharaRepl, setEnableCharaReplCheck] = useState<boolean>(true)
    const [resAreaOrgCharaVisible, setResAreaOrgCharaVisible] = useState(true)
    const [resAreaRplCharaVisible, setresAreaRplCharaVisible] = useState(true)
    const [resAreaDressVisible, setresAreaDressVisible] = useState(true)
    const [isModalVisible, setModalVisible] = useState(false)
    const [liveCharaStateFunc, setLiveCharaStateFunc] = useState<React.Dispatch<React.SetStateAction<umaLiveChara>>>(() => setLiveChara1)
    const liveCharaRadioArr = [{ liveChara: liveChara1, checked: true, fun: setLiveChara1 }, { liveChara: liveChara2, checked: false, fun: setLiveChara2 },
    { liveChara: liveChara3, checked: false, fun: setLiveChara3 }, { liveChara: liveChara4, checked: false, fun: setLiveChara4 },
    { liveChara: liveChara5, checked: false, fun: setLiveChara5 }]
    const setLiveCharaArr = [setLiveChara1, setLiveChara2, setLiveChara3, setLiveChara4, setLiveChara5]
    //#endregion

    //#region fun declaration
    const showSnackBar = (message: string) => {
        setSnackBarMessage(message)
        setSnackBarVisible(true)
        sleep(5000).then(() => setSnackBarVisible(false))
    }

    const onSearchClick = async (from: string) => {
        try {
            switch (from) {
                case strOrgChara: {
                    const data = await getCharaData({ charaName: searchTextOrgChara.trim() })
                    setOriginalChara(data)
                    break
                }
                case strReplace: {
                    const data = await getCharaData({ charaName: searchTextReplace.trim() })
                    setReplChara(data)
                    break
                }
                case strDress: {
                    const data = await getDressData({ name: searchTextDress.trim() })
                    setDress(data)
                    break
                }
                default:
                    showSnackBar("select character or dress radio button at first")
                    break
            }
        } catch (err: any) {
            showSnackBar(err)
        }
    }

    const onApplyChangesClick = async () => {
        let ret
        try {
            ret = await changeConfig("liveJson", {
                liveCharas: [
                    { origCharId: liveChara1.originalCharaID, newChrId: liveChara1.replCharaID, newClothId: liveChara1.dressID },
                    { origCharId: liveChara2.originalCharaID, newChrId: liveChara2.replCharaID, newClothId: liveChara2.dressID },
                    { origCharId: liveChara3.originalCharaID, newChrId: liveChara3.replCharaID, newClothId: liveChara3.dressID },
                    { origCharId: liveChara4.originalCharaID, newChrId: liveChara4.replCharaID, newClothId: liveChara4.dressID },
                    { origCharId: liveChara5.originalCharaID, newChrId: liveChara5.replCharaID, newClothId: liveChara5.dressID }
                ],
                option: {
                    isEnableCharaRepl: isEnableCharaRepl
                }
            })
        } catch (err) {
            ret = err
        }
        showSnackBar(ret)
    }

    const onPresetClick = async () => {
        if (!isModalVisible) setModalVisible(true)
        try {
            setPreset(await getPreset({ col: umamusumeDoc.uma_live, query: {} }))
        } catch (err: any) {
            showSnackBar(err)
        }
    }

    const onSavePresetClick = async () => {
        let ret

        try {
            ret = await savePreset("saveLivePreset", {
                col: umamusumeDoc.uma_live,
                data: [liveChara1, liveChara2, liveChara3, liveChara4, liveChara5]
            })
        } catch (err) {
            ret = err
        }
        showSnackBar(ret)
    }

    const onApplyPresetClick = (preset: umaLive) => {
        setLiveCharaArr.map((fun, index) => fun({ ...preset.data[index] }))
        onChangeliveCharaRadio(preset.data[0], setLiveChara1, 0)
        setModalVisible(false)
    }

    const onChangeliveCharaRadio = (data: umaLiveChara, fun: React.Dispatch<React.SetStateAction<umaLiveChara>>, id: number) => {
        let tmpOrg = { ...initCharaNameData }
        let tmpRpl = { ...initCharaNameData }
        let tmpDrs = { ...initDressNameData }

        setSelectedLiveCharaRadio(id)
        //setSelectedLiveChara({...data})
        setLiveCharaStateFunc(() => fun)

        tmpOrg.id = data.originalCharaID
        tmpOrg.chara_name = data.originalCharaName
        setSelectedOriginalChara(tmpOrg)

        tmpRpl.id = data.replCharaID
        tmpRpl.chara_name = data.replCharaName
        setSelectedReplChara(tmpRpl)

        tmpDrs.id = data.dressID
        tmpDrs.dress_name = data.dressName
        setSelectedDress(tmpDrs)
    }

    const onAddButton = () => {
        let tmp = { ...initUmaLiveChara }
        tmp.originalCharaID = selectedOriginalChara.id
        tmp.originalCharaName = selectedOriginalChara.chara_name
        tmp.replCharaID = selectedReplChara.id
        tmp.replCharaName = selectedReplChara.chara_name
        tmp.dressID = selectedDress.id
        tmp.dressName = selectedDress.dress_name
        liveCharaStateFunc(tmp)
    }

    const onRemoveButton = () => {
        if (selectedLiveCharaRadio >= 0) setLiveCharaArr[selectedLiveCharaRadio]({ ...initUmaLiveChara })
    }

    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>, from: string) => {
        if (!e.nativeEvent.isComposing && e.key === "Enter") onSearchClick(from)
    }
    //#endregion

    return (
        <div className="searchUma2">
            {isModalVisible && (
                <SelectLivePreset presetData={preset} selectedLiveCharaArr={[liveChara1, liveChara2, liveChara3, liveChara4, liveChara5]}
                    setModalVisible={setModalVisible} onApplyPresetClick={onApplyPresetClick} onPresetClick={onPresetClick} />
            )}
            <div className="contentContainer" style={{ marginLeft: (sideBarWidth === 0 ? 70 : 40) + "px" }}>
                <div className="header">
                    <div className="liveCharaListContainer">
                        {liveCharaRadioArr.map((radio, index) =>
                            <div key={index}>
                                <label key={index}>
                                    <input type="radio" name="liveChara" defaultChecked={radio.checked} onClick={() => onChangeliveCharaRadio(radio.liveChara, radio.fun, index)} />
                                    {`${index}
                                    ${radio.liveChara.originalCharaID + ":" + (radio.liveChara.originalCharaName.length === 0 ? "n/a" : radio.liveChara.originalCharaName)}
                                    → ${radio.liveChara.replCharaID + ":" + (radio.liveChara.replCharaName.length === 0 ? "n/a" : radio.liveChara.replCharaName)}
                                    (${radio.liveChara.dressID + ":" + (radio.liveChara.dressName.length === 0 ? "n/a" : radio.liveChara.dressName)})`}
                                </label>
                                {selectedLiveCharaRadio === index && radio.liveChara.originalCharaID + radio.liveChara.replCharaID + radio.liveChara.dressID > 0 && (
                                    <button className="btnRemove" onClick={onRemoveButton}>remove</button>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <button onClick={onPresetClick}>preset</button>
                        <button onClick={onSavePresetClick}>save as preset</button>
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" defaultChecked={isEnableCharaRepl} onChange={e => setEnableCharaReplCheck(e.target.checked)} />
                            enable character replacement
                        </label>
                    </div>
                    <div>
                        <button onClick={onAddButton}>add to {selectedLiveCharaRadio}</button>
                        <span className="selectedData">
                            <span>(selected)</span>
                            {selectedOriginalChara.id === 0 ? "n/a" : selectedOriginalChara.chara_name}
                            {" → "}{selectedReplChara.id === 0 ? "n/a" : selectedReplChara.chara_name}
                            {` : ${selectedDress.id === 0 ? "n/a" : selectedDress.dress_name}`}
                        </span>
                    </div>
                </div>
                <div className="resultOrgCharaContainer">
                    <h3 className="title" onClick={() => setResAreaOrgCharaVisible(!resAreaOrgCharaVisible)}>original character</h3>
                    <div style={{ display: resAreaOrgCharaVisible ? "block" : "none" }}>
                        <div>
                            <input type="text" value={searchTextOrgChara} className="searchTextBox" onKeyDown={e => onEnter(e, strOrgChara)} onChange={e => setSearchTextOrgChara(e.target.value)} />
                            <button onClick={() => onSearchClick(strOrgChara)}>search</button>
                        </div>
                        <GetUmaHome setSelectedCharaData={setSelectedOriginalChara} charaData={originalCharaData} radioName={strOrgChara} key={strOrgChara} />
                    </div>
                </div>
                <div className="resultCharaContainer">
                    <h3 className="title" onClick={() => setresAreaRplCharaVisible(!resAreaRplCharaVisible)}>replacement character</h3>
                    <div style={{ display: resAreaRplCharaVisible ? "block" : "none" }}>
                        <div>
                            <input type="text" value={searchTextReplace} className="searchTextBox" onKeyDown={e => onEnter(e, strReplace)} onChange={e => setSearchTextReplace(e.target.value)} />
                            <button onClick={() => onSearchClick(strReplace)}>search</button>
                        </div>
                        <GetUmaHome setSelectedCharaData={setSelectedReplChara} charaData={replCharaData} radioName={strReplace} key={strReplace} />
                    </div>
                </div>
                <div className="resultDressContainer">
                    <h3 className="title" onClick={() => setresAreaDressVisible(!resAreaDressVisible)}>dress</h3>
                    <div style={{ display: resAreaDressVisible ? "block" : "none" }}>
                        <div>
                            <input type="text" value={searchTextDress} className="searchTextBox" onKeyDown={e => onEnter(e, strDress)} onChange={e => setSearchTextDress(e.target.value)} />
                            <button onClick={() => onSearchClick(strDress)}>search</button>
                        </div>
                        <GetUmaDress setSelectedDressData={setSelectedDress} dressData={dressData} radioName={strDress} key={strDress} />
                    </div>
                </div>
            </div>
            <button onClick={onApplyChangesClick} className="btnApplyChanges">apply</button>
            <SnackBar message={snackBarMessage} visible={snackBarVisible} setVisible={setSnackBarVisible}/>
        </div>
    )
}

export default SearchUma2