const Replicate = require('replicate');
const prisma = require('../config/database');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Helper to get public avatar URL (Replicate needs public URLs)
const getAvatarUrl = (bodyType) => {
  const avatars = {
    slim: 'https://raw.githubusercontent.com/Saqlain7619/Full-Stack_Web/main/frontend/public/avatars/slim.png',
    medium: 'https://raw.githubusercontent.com/Saqlain7619/Full-Stack_Web/main/frontend/public/avatars/medium.png',
    plus: 'https://raw.githubusercontent.com/Saqlain7619/Full-Stack_Web/main/frontend/public/avatars/heavy.png',
    heavy: 'https://raw.githubusercontent.com/Saqlain7619/Full-Stack_Web/main/frontend/public/avatars/heavy.png'
  };
  return avatars[bodyType] || avatars.medium;
};

exports.generateTryOn = async (req, res) => {
  const { productId, productImage, bodyType = 'medium' } = req.body;

  if (!productId || !productImage) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // 1. Check Cache first
  const cachedResult = await prisma.tryOnCache.findFirst({
    where: { 
      productId,
      bodyType
    }
  });

  if (cachedResult) {
    console.log(`[TRY-ON] Cache hit for ${productId} (${bodyType})`);
    return res.json({ success: true, resultImage: cachedResult.resultImage, cached: true });
  }

  let fullProductUrl = productImage;

  try {
    console.log(`--- Starting Replicate AI Synthesis for ${productId} (${bodyType}) ---`);
    
    // We use a public URL for the avatar models so Replicate can fetch them
    const humanImageUrl = getAvatarUrl(bodyType);
    
    // CRITICAL: Replicate cannot access localhost.
    if (!productImage.startsWith('http')) {
      if (process.env.NODE_ENV === 'development' || productImage.includes('localhost')) {
        console.warn('[TRY-ON] Detected localhost. Using PUBLIC DEMO GARMENT for testing.');
        // This is a public URL that Replicate CAN reach
        fullProductUrl = 'https://raw.githubusercontent.com/cuuupid/idm-vton/main/example/garment/upper_body/sweater.webp';
      } else {
        fullProductUrl = `${process.env.VITE_API_URL}${productImage}`;
      }
    }

    console.log('--- REPLICATE REQUEST DETAILS ---');
    console.log('Human Image (Public):', humanImageUrl);
    console.log('Product Image (Using Demo for Localhost):', fullProductUrl);
    console.log('-------------------------------');

    // Call Replicate IDM-VTON
    // Using the specific version provided by the user
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          human_img: humanImageUrl,
          garm_img: fullProductUrl,
          garment_des: "clothing item",
          category: "upper_body"
        }
      }
    );

    const resultImage = Array.isArray(output) ? output[0] : output;

    if (!resultImage) {
      throw new Error('No result from Replicate');
    }

    // 4. Save to Cache
    await prisma.tryOnCache.upsert({
      where: {
        productId_bodyType: {
          productId,
          bodyType
        }
      },
      update: { resultImage },
      create: {
        productId,
        bodyType,
        resultImage
      }
    });

    res.json({ success: true, resultImage, cached: false });

  } catch (error) {
    console.error('Replicate error:', error);
    
    let errorMsg = 'AI generation failed';
    if (error.message.includes('fetch') || error.message.includes('404')) {
      errorMsg = 'Replicate could not fetch your image. Ensure your product image is hosted publicly (e.g., on Cloudinary) and not on localhost.';
    }

    res.status(500).json({ 
      success: false, 
      message: errorMsg, 
      details: error.message,
      isLocalhostError: fullProductUrl.includes('localhost'),
      useFallback: true
    });
  }
};
