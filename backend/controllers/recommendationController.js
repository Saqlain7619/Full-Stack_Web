const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateRecommendations = async (req, res) => {
  const { productId, recommendedProductIds } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      // Delete old recommendations for the product
      await tx.productRecommendation.deleteMany({
        where: { productId }
      });

      // Insert new recommendations
      if (recommendedProductIds && recommendedProductIds.length > 0) {
        const recommendationsData = recommendedProductIds.map(id => ({
          productId,
          recommendedProductId: id
        }));

        await tx.productRecommendation.createMany({
          data: recommendationsData
        });
      }
    });

    res.status(200).json({ success: true, message: 'Recommendations updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  const { productId } = req.params;

  try {
    const recommendations = await prisma.productRecommendation.findMany({
      where: { productId },
      include: {
        recommendedProduct: {
          include: {
             category: true 
          }
        }
      }
    });

    let products = recommendations.map(r => r.recommendedProduct);

    // Filter inactive or out-of-stock products
    products = products.filter(p => p.active && p.stock > 0);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  updateRecommendations,
  getRecommendations
};
