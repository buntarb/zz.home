goog.provide( 'zz.home.services.GoldenMath' );
goog.require( 'goog.style' );
goog.require( 'goog.math.Size' );
goog.require( 'zz.services.BaseService' );

/**
 * Service.
 * @extends {zz.services.BaseService}
 */
zz.home.services.GoldenMath = class extends zz.services.BaseService{

	constructor( ){
		super( 'zz.home.services.GoldenMath' );
	}
	
    /**
     * @param {number} length
     * @param {boolean=} return_smaller
     * @returns {number}
     */
    getGoldenInner( length, return_smaller ){
    
    	if( return_smaller )
    
    		return parseInt(
    		    zz.home.services.GoldenMath.SMALL_PART * length );
    
    	return parseInt(
    	    zz.home.services.GoldenMath.BIG_PART * length );
    }
    
    /**
     * @param {number} length
     * @param {boolean=} return_smaller
     * @returns {number}
     */
    getGoldenOuter( length, return_smaller ){
    
    	if( return_smaller )
    
    		return parseInt(
    		    zz.home.services.GoldenMath.SMALL_PART /
    		    zz.home.services.GoldenMath.BIG_PART
    		    * length );
    
    	return parseInt(
    	    zz.home.services.GoldenMath.BIG_PART /
    	    zz.home.services.GoldenMath.SMALL_PART *
    	    length );
    }
    
    /**
     * @param width
     * @param height
     * @returns {goog.math.Size}
     */
    getGoldenSize( width, height ){
    
        width = width - goog.style.getScrollbarWidth( );
    	height = this.getGoldenInner( width );
    	return new goog.math.Size( width, height );
    }
    
    /**
     * @param {number} width
     * @param {number} length
     */
    getRandomWidthSet( width, length ){
        
        var result = [ width ];
        length--;
        while( length ){
            
            var setLength = goog.math.randomInt( length ) + 1;
            if( setLength > 1 ){
                
                var returnSmaller = !goog.math.randomInt( 2 );
                var goldenWidth =
                    this.getGoldenInner( width, returnSmaller );
                if( setLength === 2 ){
                    
                    result.push( returnSmaller ?
                    
                        goldenWidth :
                        width - goldenWidth );
                    
                    result.push( returnSmaller ?
                    
                        width - goldenWidth :
                        goldenWidth );
                    
                }
                if( setLength === 3 ){
                    
                    var subWidth = returnSmaller ? 
                        width - goldenWidth : goldenWidth;
                    
                    var subGoldenWidth = 
                        this.getGoldenInner( subWidth, returnSmaller );
                    
                    result.push( width - subWidth );
                    
                    result.push( returnSmaller ? 
                    
                        subWidth - subGoldenWidth :
                        subGoldenWidth );
                        
                    result.push( returnSmaller ? 
                    
                        subGoldenWidth :
                        subWidth - subGoldenWidth );
                }
            }else{
                
                result.push( width );
            }
            length = length - setLength;
        }
        return result;
    }
};

/**
 * @type {number}
 */
zz.home.services.GoldenMath.BIG_PART = 0.618;

/**
 * @type {number}
 */
zz.home.services.GoldenMath.SMALL_PART = 0.382;

goog.addSingletonGetter( zz.home.services.GoldenMath );
