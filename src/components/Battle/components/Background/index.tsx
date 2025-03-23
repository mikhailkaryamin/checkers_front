import { observer } from 'mobx-react-lite';
import { BackgroundImage } from 'src/components/BackgroundImage';
import { Props } from './types';

export const Background = observer(function Background(props: Props) {
  const { model } = props;
  return <BackgroundImage src={model.src} />;
});
