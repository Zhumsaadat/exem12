import {Router} from "express";
import PhotoGallery from "../models/PhotoGallery";
import auth, {RequestWithUser} from "../middleware/auth";
import {imageUpload} from "../multer";
import {Types} from "mongoose";
import permit from '../middleware/permit';

const photoGalleryRouter = Router();

photoGalleryRouter.get('/', async (req, res, next) => {
  try {
    let photos;
    const user = req.query.user as string;
    if(user){
      photos = await PhotoGallery.find({user: user});
    } else{
      photos = await PhotoGallery.find();
    }
    res.send(photos);
  } catch (err) {
    return next(err);
  }
});

photoGalleryRouter.get('/:id', async (req, res, next) => {
  try {
    let _id: Types.ObjectId;

    try {
      _id = new Types.ObjectId(req.params.id);
    } catch (e) {
      return res.status(404).send({ error: 'Wrong ObjectId' });
    }

    const photo = await PhotoGallery.findOne({ _id });

    if (!photo) {
      return res.status(404).send({ error: 'Not found!' });
    }

    return res.send(photo);
  } catch (e) {
    next(e);
  }
});

photoGalleryRouter.post('/', auth, imageUpload.single('image'), async (req: RequestWithUser, res, next) => {
  try {
    const photo = new PhotoGallery({
      user: req.user?._id,
      title: req.body.title,
      image: req.file && req.file.filename,
    });

    await photo.save();

    res.send(photo);
  } catch (err) {
    return next(err);
  }
});


photoGalleryRouter.delete('/:id', auth, permit('admin', 'user'), async (req: RequestWithUser, res, next) => {
  try {
    const photoId = req.params.id;
    const photo = await PhotoGallery.findById(photoId);

    if (!photo) {
      return res.status(404).send({error: 'Photo not found!'});
    }
    if (req.user?.role !== 'admin' && photo.user.toString() !== req.user?._id.toString()) {
      return res.status(403).send({error: 'Not authorized to delete this photo!'});
    }

    await PhotoGallery.findByIdAndDelete(photoId);
    console.log(PhotoGallery.findById(photoId));
    return res.status(204).send({message: 'Photo is deleted'});
  }catch (error) {
    next(error);
  }
});



export default photoGalleryRouter;