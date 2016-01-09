import submitted from './signals/submitted';
import titleChanged from './signals/titleChanged';

export default (options = {}) => {
  return (module) => {

    module.state({
      title: '',
      isSaving: false
    });

    module.signalsSync({
      titleChanged
    });
    
    module.signals({
      submitted
    });


  };
}
