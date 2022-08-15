import { useFormContext, Controller } from 'react-hook-form';
import FileField from '../../FileField/FileField';
import { PictureSeletion } from '../UserForm.styled';

export const PictureForm = () => {
  const { control } = useFormContext();
  return (
    <PictureSeletion>
      <Controller
        name={'usuario.foto_documento'}
        defaultValue={''}
        control={control}
        render={({field}) => {
          return (
            <FileField
              onChange={(files) => field.onChange(files[0])}
              inputProps={{ accept: '.jpeg, .jpg, .png' }}
            />
          );
        }}
      />
      
    </PictureSeletion>
  );
};
