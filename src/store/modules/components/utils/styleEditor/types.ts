import IStyle from '@/domain/util/interface/map/IStyle';

export default interface StyleEditorState {
    geometryType: string;
    style: IStyle;
    jsonStyle: string;
}
